import { createExerciseTemplates } from '../exerciseTemplates/exerciseTemplates.service';
import { CreateWorkoutTemplateInput, WorkoutTemplate } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';

export const savedWorkoutTemplates: WorkoutTemplate[] = [];

export function createWorkoutTemplates(workoutTemplates: CreateWorkoutTemplateInput[], userId: string) {

  const output: WorkoutTemplate[] = [];

  for (const workoutTemplate of workoutTemplates) {

    const newWorkoutTemplateId = uuid();

    createExerciseTemplates(workoutTemplate.exerciseTemplates, newWorkoutTemplateId);

    const newWorkoutTemplate: WorkoutTemplate = {
      id: newWorkoutTemplateId,
      name: workoutTemplate.name,
      backgroundColor: workoutTemplate.backgroundColor,
      userId,
    }

    savedWorkoutTemplates.push(newWorkoutTemplate);

    output.push({ ...newWorkoutTemplate, key: workoutTemplate.key });
  }

  return output;
}
