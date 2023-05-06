import { Context } from '../context';
import { ExerciseTemplateResolvers, MutationResolvers, Resolvers } from '../generated/graphql.generated';
import { savedSetTemplates } from '../setTemplates/setTemplates.service';

const setTemplatesResolver: ExerciseTemplateResolvers<Context>['setTemplates'] = (parent) => {
  return savedSetTemplates.filter(s => s.exerciseTemplateId === parent.id);
}

const updateExerciseTemplatesResolver: MutationResolvers<Context>['updateExerciseTemplates'] = (_parent, args) => {
  console.warn('Not implemented');
  return [];
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateExerciseTemplates: updateExerciseTemplatesResolver,
  },
  ExerciseTemplate: {
    setTemplates: setTemplatesResolver,
  }
}

export default resolvers;
