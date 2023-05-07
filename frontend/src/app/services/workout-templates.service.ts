import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { cloneDeep } from 'lodash-es';
import { filter, map, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables, CreateWorkoutTemplatesMutationVariables, CreateWorkoutTemplateInput, UserWorkoutTemplatesGQL, CreateExerciseTemplateInput, CreateSetTemplateInput } from '../../generated/graphql.generated';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { RecursivePartial, RequiredKey } from '../shared/utils';

export type FrontendWorkoutTemplate = RequiredKey<RecursivePartial<WorkoutTemplate>>;

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  userId?: string | null;

  workoutTemplates: RecursivePartial<WorkoutTemplate>[] = []

  editWorkoutTemplateKey?: string;

  currentKey = 0;

  userWorkoutTemplatesQuery?: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

  subs = new SubSink();

  constructor(
    private createWorkoutTemplatesGQL: CreateWorkoutTemplatesGQL,
    private userWorkoutTemplatesGQL: UserWorkoutTemplatesGQL,
  ) {}

  addWorkoutTemplate(newWorkoutTemplate: RecursivePartial<WorkoutTemplate>) {

    newWorkoutTemplate.key = this.currentKey.toString();

    this.currentKey++;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  editWorkoutTemplate(editedWorkoutTemplate: RecursivePartial<WorkoutTemplate>) {

    if (this.userId) {
      this.updateExistingWorkoutTemplate(editedWorkoutTemplate);
    }

    if (this.editWorkoutTemplateKey === undefined) { return; }

    editedWorkoutTemplate.key = this.editWorkoutTemplateKey;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates ];

    updatedWorkoutTemplates.splice(this.workoutTemplateToEditIndex, 1, editedWorkoutTemplate);

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  updateExistingWorkoutTemplate(_editedWorkoutTemplate: RecursivePartial<WorkoutTemplate>) {
  }

  onAuthSuccess(userId: string) {
    this.userId = userId;

    const watchQueryVariables: UserWorkoutTemplatesQueryVariables = { userId };

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch(watchQueryVariables, { fetchPolicy: 'cache-and-network' });

    this.subs.sink = this.userWorkoutTemplatesQuery.valueChanges.pipe(
      filter(res => !res.loading),
      map(res => cloneDeep(res.data.user?.workoutTemplates) || []),
      tap(userTemplates => this.setKeys(userTemplates)),
    ).subscribe(userTemplates => this.workoutTemplates = userTemplates);
  }

  setKeys(workoutTemplates: RecursivePartial<WorkoutTemplate>[]) {
    for (const template of workoutTemplates) {
      template.key = template.id;
    }
  }

  createUnsavedWorkoutTemplates() {
    const unsavedWorkoutTemplates: CreateWorkoutTemplateInput[] = [];

    for (const template of this.workoutTemplates) {
      if (template.id) { continue; }

      if (!template.key) {
        throw new Error('Cannot save a workout template without a key');
      }

      template.exerciseTemplates = template.exerciseTemplates || [];

      const createExerciseTemplateInputs: CreateExerciseTemplateInput[] = [];
      
      for (const exerciseTemplate of template.exerciseTemplates) {
        const createSetTemplateInputs: CreateSetTemplateInput[] = [];

        for (const setTemplate of exerciseTemplate?.setTemplates || []) {

          const createSetTemplateInput: CreateSetTemplateInput = {
            exerciseItemId: setTemplate?.exerciseTemplateId || '',
            order: setTemplate?.order || 0,
          }

          createSetTemplateInputs.push(createSetTemplateInput);
        }

        const createExerciseTemplateInput: CreateExerciseTemplateInput = {
          order: exerciseTemplate?.order || 0,
          setTemplates: createSetTemplateInputs,
        }

        createExerciseTemplateInputs.push(createExerciseTemplateInput);
      }

      const unsavedTemplate: CreateWorkoutTemplateInput = {
        backgroundColor: template.backgroundColor,
        exerciseTemplates: createExerciseTemplateInputs,
        key: template.key,
        name: template.name || '',
      };

      unsavedWorkoutTemplates.push(unsavedTemplate)
    }

    if (!unsavedWorkoutTemplates.length) { return of([]); }

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: unsavedWorkoutTemplates,
    };

    return this.createWorkoutTemplatesGQL.mutate(mutationVariables)
      .pipe(
        filter(res => !res.loading),
        map(res => res.data?.createWorkoutTemplates || []),
        tap(userWorkoutTemplates => this.workoutTemplates = userWorkoutTemplates),
      );
  }

  reset() {
    this.userId = null;
    this.workoutTemplates = [];
    this.editWorkoutTemplateKey = undefined;
    this.currentKey = 0;
    this.subs.unsubscribe();
  }

  get workoutTemplateToEdit() {
    return this.workoutTemplates.find(t => t.key === this.editWorkoutTemplateKey);
  }

  get workoutTemplateToEditIndex() {
    return this.workoutTemplates.findIndex(t => t.key === this.editWorkoutTemplateKey);
  }
}
