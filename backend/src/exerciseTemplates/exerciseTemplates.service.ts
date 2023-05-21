import { CreateExerciseTemplateInput, ExerciseTemplate, UpdateExerciseTemplateInput } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { createSetTemplates } from '../setTemplates/setTemplates.service';
import { RequiredBy } from '../utils/types';

export type SavedExerciseTemplate = RequiredBy<ExerciseTemplate, 'workoutTemplateId' | 'id'>;

export let savedExerciseTemplates: SavedExerciseTemplate[] = [];

export function createExerciseTemplates(exerciseTemplates: CreateExerciseTemplateInput[], workoutTemplateId: string) {
  const output: SavedExerciseTemplate[] = [];

  for (const exerciseTemplate of exerciseTemplates) {

    const newExerciseTemplateId = uuid();

    createSetTemplates(exerciseTemplate.setTemplates, newExerciseTemplateId);

    const newExerciseTemplate: SavedExerciseTemplate = {
      id: newExerciseTemplateId,
      name: exerciseTemplate.name,
      order: exerciseTemplate.order,
      workoutTemplateId,
    }

    savedExerciseTemplates.push(newExerciseTemplate);

    output.push(newExerciseTemplate);
  }

  return output;
}

export function updateExerciseTemplate(exerciseTemplateId: string, update: Pick<UpdateExerciseTemplateInput, 'order'>) {

  const exerciseTemplateIndex = savedExerciseTemplates.findIndex(et => et.id === exerciseTemplateId);

  const currentValue = savedExerciseTemplates[exerciseTemplateIndex];

  if (!currentValue) {
    throw new Error('Could not find exercise template');
  }

  const updatedExerciseTemplate = {
    ...currentValue,
    order: update.order || currentValue.order,
  }

  savedExerciseTemplates.splice(exerciseTemplateIndex, 1, updatedExerciseTemplate);
}

export function deleteExerciseTemplates(exerciseTemplateIds: string[]) {
  savedExerciseTemplates = savedExerciseTemplates.filter(et => !exerciseTemplateIds.includes(et.id));
}


