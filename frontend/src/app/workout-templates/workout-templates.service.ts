import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { switchMap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables, ExerciseTemplate, CreateWorkoutTemplatesMutationVariables } from '../../generated/graphql.generated';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { OptionalId, RequiredKey } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  workoutTemplates: OptionalId<WorkoutTemplate>[] = []

  editWorkoutTemplateKey?: string;

  currentKey = 0;

  subs = new SubSink();

  userWorkoutTemplatesQuery!: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

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
    const unsavedWorkoutTemplates: RequiredKey<OptionalId<WorkoutTemplate>>[] = [];

    for (const template of this.workoutTemplates) {
      if (template.id) { continue; }

      if (!template.key) {
        throw new Error('Cannot save a workout template without a key');
      }

      const templateExercises: Array<OptionalId<ExerciseTemplate>>= template.exercises
        .map(e => ({
          exerciseType: e.exerciseType,
          order: e.order,
          sets: e.sets,
        }));

      const unsavedTemplate: RequiredKey<OptionalId<WorkoutTemplate>> = {
        name: template.name,
        exercises: templateExercises,
        backgroundColor: template.backgroundColor,
        key: template.key,
      };

      unsavedWorkoutTemplates.push(unsavedTemplate)
    }

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: unsavedWorkoutTemplates,
    };

    const workoutTemplatesQueryVariables: UserWorkoutTemplatesQueryVariables = { userId };

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch(workoutTemplatesQueryVariables);

    this.subs.sink = this.createWorkoutTemplatesGQL.mutate(mutationVariables)
      .pipe(switchMap(() => this.userWorkoutTemplatesQuery.valueChanges))
      .subscribe((res) => {
        if (res.loading) { return; }
        const userWorkoutTemplates = res.data.user?.workoutTemplates || [];
        this.workoutTemplates = userWorkoutTemplates.map(t => ({
          ...t,
          key: t.id,
        }));
      })
  }

  reset() {
    this.workoutTemplates = [];
    this.editWorkoutTemplateKey = undefined;
    this.currentKey = 0;
    this.subs.unsubscribe();
  }

}
