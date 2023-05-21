import { createExerciseTemplates } from '../exerciseTemplates/exerciseTemplates.service';
import { CreateWorkoutTemplateInput, UpdateWorkoutTemplateInput, WorkoutTemplate } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';

export type SavedWorkoutTemplate = RequiredBy<WorkoutTemplate, 'id'>;

export const savedWorkoutTemplates: SavedWorkoutTemplate[] = [];

export function createWorkoutTemplates(workoutTemplates: CreateWorkoutTemplateInput[], userId: string) {

  const output: WorkoutTemplate[] = [];

  for (const workoutTemplate of workoutTemplates) {

    const newWorkoutTemplateId = uuid();

    createExerciseTemplates(workoutTemplate.exerciseTemplates, newWorkoutTemplateId);

    const newWorkoutTemplate: SavedWorkoutTemplate = {
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

export function updateWorkoutTemplate(workoutTemplateId: string, update: Pick<UpdateWorkoutTemplateInput, 'name' | 'backgroundColor'>) {

  const workoutTemplateIndex = savedWorkoutTemplates.findIndex(wt => wt.id === workoutTemplateId);

  const currentValue = savedWorkoutTemplates[workoutTemplateIndex];

  if (!currentValue) {
    throw new Error('Could not find workout template');
  }

  const updatedWorkoutTemplate = {
    ...currentValue,
    ...update,
    name: update.name || currentValue.name,
  };

  savedWorkoutTemplates.splice(workoutTemplateIndex, 1, updatedWorkoutTemplate);
}
