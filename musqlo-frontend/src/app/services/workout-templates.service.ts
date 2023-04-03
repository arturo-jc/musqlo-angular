import { Injectable } from '@angular/core';
import { ExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
  backgroundColor: string;
  key?: number;
}

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  workoutTemplates: WorkoutTemplate[] = [
    {
      name: 'My Favorite Workout',
      backgroundColor: 'var(--primary-color)',
      exercises: [
        {
          exerciseType: 'Deadlift',
          sets: [
            {
              order: 1,
              reps: 20,
              weight: 20,
            },
            {
              order: 2,
              reps: 14,
              weight: 29,
            },
            {
              order: 3,
              reps: 24,
              weight: 27,
            }
          ],
          order: 1
        },
        {
          exerciseType: 'Dumbbells and other words that make this into a very long title',
          sets: [
            {
              order: 1,
              reps: 25,
              weight: 89,
            },
          ],
          order: 2,
        }
      ],
      key: 0,
    },
    {
      name: 'My Least Favorite Workout',
      backgroundColor: 'var(--pink-500)',
      exercises: [
        {
          exerciseType: 'Runnning',
          sets: [
            {
              order: 1,
              reps: 23,
              weight: 49,
            },
          ],
          order: 1
        }
      ],
      key: 1,
    }
  ]

  editWorkoutTemplateKey?: number;

  currentKey = 2;

  addWorkoutTemplate(newWorkoutTemplate: WorkoutTemplate) {
    newWorkoutTemplate.key = this.currentKey;
    this.currentKey++;
    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];
    this.workoutTemplates = updatedWorkoutTemplates;
  }

  updateWorkoutTemplate(updatedWorkoutTemplate: WorkoutTemplate) {
    updatedWorkoutTemplate.key = this.editWorkoutTemplateKey;
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

}
