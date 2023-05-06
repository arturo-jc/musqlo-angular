import { CreateWorkoutTemplateInput, ExerciseTemplate, WorkoutTemplate } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';

export type SavedWorkoutTemplate = WorkoutTemplate & { userId: string };

export const savedWorkoutTemplates: SavedWorkoutTemplate[] = [];

export function createWorkoutTemplatesAction(workoutTemplates: CreateWorkoutTemplateInput[], userId: string) {

  const output: WorkoutTemplate[] = [];

  for (const template of workoutTemplates) {

    // const newTemplateExercises: ExerciseTemplate[] = template.exercises
    //   .map(e => ({
    //     id: uuid(),
    //     sets: e.sets,
    //     order: e.order,
    //   }))

    // const newTemplate: WorkoutTemplate = {
    //   id: uuid(),
    //   name: template.name,
    //   exercises: newTemplateExercises,
    //   backgroundColor: template.backgroundColor,
    // }

    // output.push({ ...newTemplate, key: template.key });

    // savedWorkoutTemplates.push({ ...newTemplate, userId });

  }

  return output;
}
