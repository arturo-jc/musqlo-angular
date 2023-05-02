import { Context } from "../context";
import { ExerciseTemplate, MutationResolvers, Resolvers } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';

export type SavedExerciseTemplate = ExerciseTemplate & { workoutTemplateId: string };

export const savedExerciseTemplates: SavedExerciseTemplate[] = [];

const createExerciseTemplates: MutationResolvers<Context>['createExerciseTemplates'] = (_parent, args) => {
  const output: ExerciseTemplate[] = [];

  for (const template of args.exerciseTemplates) {
    const newTemplate: ExerciseTemplate = {
      id: uuid(),
      order: template.order,
      sets: template.sets,
      exerciseItemId: template.exerciseItemId,
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

const editExerciseTemplates: MutationResolvers<Context>['editExerciseTemplates'] = (_parent, args) => {
  return [];
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    createExerciseTemplates,
    editExerciseTemplates,
  }
}

export default resolvers;
