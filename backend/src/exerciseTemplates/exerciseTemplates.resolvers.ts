import { Context } from '../context';
import { MutationResolvers, Resolvers } from '../generated/graphql.generated';

const updateExerciseTemplates: MutationResolvers<Context>['updateExerciseTemplates'] = (_parent, args) => {
  console.warn('Not implemented');
  return [];
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateExerciseTemplates,
  }
}

export default resolvers;
