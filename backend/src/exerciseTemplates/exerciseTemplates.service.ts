import { CreateExerciseTemplateInput, ExerciseTemplate, SetTemplate } from '../generated/graphql.generated';
import { savedExerciseItems } from '../exerciseItems/exerciseItems.resolvers';
import { v1 as uuid } from 'uuid';

export type SavedExerciseTemplate = ExerciseTemplate & { workoutTemplateId: string };

export const savedExerciseTemplates: SavedExerciseTemplate[] = [];

export function createExerciseTemplatesAction(exerciseTemplates: CreateExerciseTemplateInput[]) {
  const output: ExerciseTemplate[] = [];

  for (const template of exerciseTemplates) {

    const newTemplateSets: SetTemplate[] = [];

    for (const set of template.sets) {

      const exerciseItem = savedExerciseItems.find(i => i.id === set.exerciseItemId);

      if (!exerciseItem || !exerciseItem.id) {
        throw new Error('Could not resolve exercise item');
      }

      const newTemplateSet: SetTemplate = { ...set, exerciseType: exerciseItem.exerciseType };

      newTemplateSets.push(newTemplateSet);
    }

    const newTemplate: ExerciseTemplate = {
      id: uuid(),
      order: template.order,
      sets: newTemplateSets,
    }

    output.push(newTemplate);

    const savedTemplate: SavedExerciseTemplate = {
      ...newTemplate,
      workoutTemplateId: template.workoutTemplateId,
    }

    savedExerciseTemplates.push(savedTemplate);
  }

  return output;

}
