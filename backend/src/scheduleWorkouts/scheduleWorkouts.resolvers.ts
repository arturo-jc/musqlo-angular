import { Context } from '../context';
import { MutationResolvers, Resolvers } from '../generated/graphql.generated';

const updateScheduleWorkouts: MutationResolvers<Context>['updateScheduleWorkouts'] = (_parent, _args) => {
  throw new Error('not implemented!');
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateScheduleWorkouts,
  },
}

export default resolvers;
