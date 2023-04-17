import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { switchMap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables } from '../../generated/graphql.generated';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { Frontend, OptionalId } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  workoutTemplates: Frontend<WorkoutTemplate>[] = []

  editWorkoutTemplateKey?: string;

  currentKey = 0;

  subs = new SubSink();

  userWorkoutTemplatesQuery!: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

  constructor(
    private userWorkoutTemplatesGQL: UserWorkoutTemplatesGQL,
    private createWorkoutTemplatesGQL: CreateWorkoutTemplatesGQL,
  ) {}

  addWorkoutTemplate(input: OptionalId<WorkoutTemplate>) {

    const newWorkoutTemplate: Frontend<WorkoutTemplate> = {
      ...input,
      key: this.currentKey.toString(),
    }

    this.currentKey++;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  editWorkoutTemplate(input: OptionalId<WorkoutTemplate>) {
    if (this.editWorkoutTemplateKey === undefined) { return; }

    const updatedWorkoutTemplate: Frontend<WorkoutTemplate> = {
      ...input,
      key: this.editWorkoutTemplateKey,
    }

    const updatedWorkoutTemplates = [ ...this.workoutTemplates ];

    updatedWorkoutTemplates.splice(this.workoutTemplateToEditIndex, 1, updatedWorkoutTemplate);

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  get workoutTemplateToEdit() {
    return this.workoutTemplates.find(t => t.key === this.editWorkoutTemplateKey);
  }

  get workoutTemplateToEditIndex() {
    return this.workoutTemplates.findIndex(t => t.key === this.editWorkoutTemplateKey);
  }

  createUnsavedWorkoutTemplates(userId: string) {
    const unsavedWorkoutTemplates: OptionalId<WorkoutTemplate>[] = [];

    for (const template of this.workoutTemplates) {
      if (template.id) { continue; }

      const templateExercises: OptionalId<WorkoutTemplate>['exercises'] = template.exercises
        .map(e => ({
          exerciseType: e.exerciseType,
          order: e.order,
          sets: e.sets,
        }));

      const unsavedTemplate: OptionalId<WorkoutTemplate> = {
        name: template.name,
        exercises: templateExercises,
        backgroundColor: template.backgroundColor,
      };

      unsavedWorkoutTemplates.push(unsavedTemplate)
    }

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch({ userId });

    this.subs.sink = this.createWorkoutTemplatesGQL.mutate({ workoutTemplates: unsavedWorkoutTemplates })
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

}
