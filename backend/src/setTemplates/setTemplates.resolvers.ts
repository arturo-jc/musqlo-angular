import { Context } from '../context';
import { savedExerciseItems } from '../exerciseItems/exerciseItems.resolvers';
import { MutationResolvers, Resolvers, SetTemplateResolvers } from '../generated/graphql.generated';

export const updateSetTemplatesResolver: MutationResolvers<Context>['updateSetTemplates'] = (_parent, _args) => {
  throw new Error('Not implemented');
}

const categoryResolver: SetTemplateResolvers<Context>['category'] = (parent) => {
  const exerciseItem = savedExerciseItems.find(i => i.id === parent.exerciseItemId);

  if (!exerciseItem) {
    throw new Error('Could not resolve exercise item');
  }

  return exerciseItem.category;
}

const exerciseTypeResolver: SetTemplateResolvers<Context>['exerciseType'] = (parent) => {
  const exerciseItem = savedExerciseItems.find(i => i.id === parent.exerciseItemId);

  if (!exerciseItem) {
    throw new Error('Could not resolve exercise item');
  }

  return exerciseItem.exerciseType;
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateSetTemplates: updateSetTemplatesResolver,
  },
  SetTemplate: {
    category: categoryResolver,
    exerciseType: exerciseTypeResolver,
  }
}

export default resolvers;
