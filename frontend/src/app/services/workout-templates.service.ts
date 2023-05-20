import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
// import { partition } from 'lodash-es';
import { filter, map, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables, CreateWorkoutTemplatesMutationVariables, CreateWorkoutTemplateInput, UserWorkoutTemplatesGQL, CreateExerciseTemplateInput, CreateSetTemplateInput, WorkoutTemplate, User, FullWorkoutTemplateFragment, UpdateWorkoutTemplateGQL, UpdateWorkoutTemplateInput, UpdateExerciseTemplateInput } from '../../generated/graphql.generated';
import { FrontendService, FrontendWorkoutTemplate } from '../services/frontend.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  userId?: string | null;

  workoutTemplates: FrontendWorkoutTemplate[] = []

  editWorkoutTemplateKey?: string;

  _currentKey = 0;

  userWorkoutTemplatesQuery?: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

  subs = new SubSink();

  constructor(
    private createWorkoutTemplatesGQL: CreateWorkoutTemplatesGQL,
    private userWorkoutTemplatesGQL: UserWorkoutTemplatesGQL,
    // private updateWorkoutTemplateGQL: UpdateWorkoutTemplateGQL,
    private frontend: FrontendService,
  ) {}

  addWorkoutTemplate(newWorkoutTemplate: FrontendWorkoutTemplate) {

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  editWorkoutTemplate(_editedWorkoutTemplate: FrontendWorkoutTemplate) {

    if (this.userId) {
      this.updateExistingWorkoutTemplate(_editedWorkoutTemplate);
    }

    if (this.editWorkoutTemplateKey === undefined) { return; }

    _editedWorkoutTemplate.key = this.editWorkoutTemplateKey;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates ];

    updatedWorkoutTemplates.splice(this.workoutTemplateToEditIndex, 1, _editedWorkoutTemplate);

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  updateExistingWorkoutTemplate(_editedWorkout: FrontendWorkoutTemplate) {

    // const [ _existingExerciseTemplates, newExerciseTemplates ] = partition(_editedWorkout.exerciseTemplates, e => e.id);

    // const updateExerciseTemplate: UpdateExerciseTemplateInput = {
    // }

    // const updateWorkoutTemplateInput: UpdateWorkoutTemplateInput = {
    //   addExerciseTemplates: newExerciseTemplates,
    //   removeExerciseTemplates: [],
    // }
  }

  onAuthSuccess(userId: string) {
    this.userId = userId;

    const watchQueryVariables: UserWorkoutTemplatesQueryVariables = { userId };

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch(watchQueryVariables, { fetchPolicy: 'cache-and-network' });

    this.subs.sink = this.userWorkoutTemplatesQuery.valueChanges.pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertWorkoutTemplates(res.data.user?.workoutTemplates, true)),
    ).subscribe(userWorkoutTemplates => this.workoutTemplates = userWorkoutTemplates);
  }

  setKeys(workoutTemplates: { key?: string | null | undefined; id: string }[]) {
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

      template.exerciseTemplates = template.exerciseTemplates;

      const createExerciseTemplateInputs: CreateExerciseTemplateInput[] = [];

      for (const exerciseTemplate of template.exerciseTemplates) {

        const createSetTemplateInputs: CreateSetTemplateInput[] = [];

        for (const setTemplate of exerciseTemplate.setTemplates) {

          const createSetTemplateInput: CreateSetTemplateInput = {
            exerciseItemId: setTemplate?.exerciseItemId,
            order: setTemplate.order,
            reps: setTemplate.reps,
            weight: setTemplate.weight,
          }

          createSetTemplateInputs.push(createSetTemplateInput);
        }

        const createExerciseTemplateInput: CreateExerciseTemplateInput = {
          name: exerciseTemplate.name,
          order: exerciseTemplate.order,
          setTemplates: createSetTemplateInputs,
        }

        createExerciseTemplateInputs.push(createExerciseTemplateInput);
      }

      const unsavedTemplate: CreateWorkoutTemplateInput = {
        backgroundColor: template.backgroundColor,
        exerciseTemplates: createExerciseTemplateInputs,
        key: template.key,
        name: template.name,
      };

      unsavedWorkoutTemplates.push(unsavedTemplate)
    }

    if (!unsavedWorkoutTemplates.length) { return of([]); }

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: unsavedWorkoutTemplates,
    };

    return this.createWorkoutTemplatesGQL.mutate(mutationVariables).pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertWorkoutTemplates(res.data?.createWorkoutTemplates)),
      tap(newWorkoutTemplates => this.workoutTemplates = newWorkoutTemplates)
    );
  }

  reset() {
    this.userId = null;
    this.workoutTemplates = [];
    this.editWorkoutTemplateKey = undefined;
    this._currentKey = 0;
    this.subs.unsubscribe();
  }

  get workoutTemplateToEdit() {
    return this.workoutTemplates.find(t => t.key === this.editWorkoutTemplateKey);
  }

  get workoutTemplateToEditIndex() {
    return this.workoutTemplates.findIndex(t => t.key === this.editWorkoutTemplateKey);
  }

  get currentKey() {
    const output = this._currentKey.toString();
    this._currentKey++;
    return output;
  }

}
