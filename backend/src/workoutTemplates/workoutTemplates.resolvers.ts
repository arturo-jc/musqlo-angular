import { Context } from "../context";
import { MutationResolvers, Resolvers, UserResolvers, WorkoutTemplate } from "../generated/graphql.generated";
// import { v1 as uuid } from 'uuid';

const workoutTemplates: { [ userId: string ]: WorkoutTemplate[]} = {};

const getWorkoutTemplates: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return workoutTemplates[parent.id] || [];
}

const createWorkoutTemplates: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, _args, ctx) => {
  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const newWorkoutTempltates: WorkoutTemplate[] = [];

  workoutTemplates[ctx.userId] = newWorkoutTempltates;

  return newWorkoutTempltates;
}

const resolvers: Resolvers<Context> = {
  User: {
    workoutTemplates: getWorkoutTemplates,
  },
  Mutation: {
    createWorkoutTemplates,
  },
}

export default resolvers;
