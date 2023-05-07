import { CreateExerciseTemplateInput, ExerciseTemplate } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { createSetTemplates } from '../setTemplates/setTemplates.service';

export type SavedExerciseTemplate = ExerciseTemplate & { workoutTemplateId: string };

export const savedExerciseTemplates: SavedExerciseTemplate[] = [];

export function createExerciseTemplates(exerciseTemplates: CreateExerciseTemplateInput[], workoutTemplateId: string) {
  const output: ExerciseTemplate[] = [];

  for (const exerciseTemplate of exerciseTemplates) {

    const newExerciseTemplateId = uuid();

    createSetTemplates(exerciseTemplate.setTemplates, newExerciseTemplateId);

    const newExerciseTemplate: ExerciseTemplate = {
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
