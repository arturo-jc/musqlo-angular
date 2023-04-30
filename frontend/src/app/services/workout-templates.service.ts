import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { filter, map, switchMap, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables, CreateWorkoutTemplatesMutationVariables, CreateWorkoutTemplateInput, CreateExerciseInput } from '../../generated/graphql.generated';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { OptionalId, RequiredKey } from '../shared/utils';

export type FrontendWorkoutTemplate = RequiredKey<OptionalId<WorkoutTemplate>>;

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  workoutTemplates: OptionalId<WorkoutTemplate>[] = []

  editWorkoutTemplateKey?: string;

  currentKey = 0;

  subs = new SubSink();

  userWorkoutTemplatesQuery?: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

  constructor(
    private userWorkoutTemplatesGQL: UserWorkoutTemplatesGQL,
    private createWorkoutTemplatesGQL: CreateWorkoutTemplatesGQL,
  ) {}

  addWorkoutTemplate(newWorkoutTemplate: OptionalId<WorkoutTemplate>) {

    newWorkoutTemplate.key = this.currentKey.toString();

    this.currentKey++;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  editWorkoutTemplate(editedWorkoutTemplate: OptionalId<WorkoutTemplate>) {

    if (this.editWorkoutTemplateKey === undefined) { return; }

    editedWorkoutTemplate.key = this.editWorkoutTemplateKey;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates ];

    updatedWorkoutTemplates.splice(this.workoutTemplateToEditIndex, 1, editedWorkoutTemplate);

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  get workoutTemplateToEdit() {
    return this.workoutTemplates.find(t => t.key === this.editWorkoutTemplateKey);
  }

  get workoutTemplateToEditIndex() {
    return this.workoutTemplates.findIndex(t => t.key === this.editWorkoutTemplateKey);
  }

  createUnsavedWorkoutTemplates(userId: string) {
    const unsavedWorkoutTemplates: CreateWorkoutTemplateInput[] = [];

    for (const template of this.workoutTemplates) {
      if (template.id) { continue; }

      if (!template.key) {
        throw new Error('Cannot save a workout template without a key');
      }

      const templateExercises: CreateExerciseInput[] = template.exercises
        .map(e => ({
          exerciseType: e.exerciseType,
          order: e.order,
          sets: e.sets,
        }));

      const unsavedTemplate: CreateWorkoutTemplateInput = {
        backgroundColor: template.backgroundColor,
        exercises: templateExercises,
        key: template.key,
        name: template.name,
      };

      unsavedWorkoutTemplates.push(unsavedTemplate)
    }

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: unsavedWorkoutTemplates,
    };

    const workoutTemplatesQueryVariables: UserWorkoutTemplatesQueryVariables = { userId };

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch(workoutTemplatesQueryVariables);

    const { valueChanges: queryValueChanges } = this.userWorkoutTemplatesQuery;

    return this.createWorkoutTemplatesGQL.mutate(mutationVariables)
      .pipe(
        switchMap(() => queryValueChanges),
        filter(res => !res.loading),
        map(res => res.data.user?.workoutTemplates || []),
        tap(userWorkoutTemplates => {

          this.workoutTemplates = userWorkoutTemplates.map(t => ({
            ...t,
            key: t.id,
          }));

          this.currentKey = 0;

        })
      );
  }

  reset() {
    this.workoutTemplates = [];
    this.editWorkoutTemplateKey = undefined;
    this.currentKey = 0;
    this.subs.unsubscribe();
  }

}