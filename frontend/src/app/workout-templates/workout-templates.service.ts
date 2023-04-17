import { Injectable } from '@angular/core';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesGQL } from '../../generated/graphql.generated';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { Frontend, OptionalId } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  workoutTemplates: Frontend<WorkoutTemplate>[] = []

  editWorkoutTemplateKey?: number;

  currentKey = 0;

  constructor(
    private userWorkoutTemplates: UserWorkoutTemplatesGQL,
    private createWorkoutTemplates: CreateWorkoutTemplatesGQL,
  ) {}

  addWorkoutTemplate(input: OptionalId<WorkoutTemplate>) {

    const newWorkoutTemplate: Frontend<WorkoutTemplate> = {
      ...input,
      key: this.currentKey,
    }

    this.currentKey++;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  updateWorkoutTemplate(input: OptionalId<WorkoutTemplate>) {
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

  createUnsavedWorkoutTemplates() {
    // const unsavedWorkoutTemplates = this.workoutTemplates.filter(t => !t.id);
  }

}
