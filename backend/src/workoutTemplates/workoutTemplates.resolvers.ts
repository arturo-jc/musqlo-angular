import { Context } from '../context';
import { savedExerciseTemplates } from '../exerciseTemplates/exerciseTemplates.service';
import { MutationResolvers, Resolvers, UserResolvers, WorkoutTemplateResolvers } from '../generated/graphql.generated';
import { createWorkoutTemplates, savedWorkoutTemplates } from './workoutTemplates.service';

const createWorkoutTemplatesResolver: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  return createWorkoutTemplates(args.workoutTemplates, ctx.userId);
}

const updateWorkoutTemplatesResolver: MutationResolvers<Context>['updateWorkoutTemplates'] = (_parent, _args) => {
  throw new Error('not implemented');
}

const workoutTemplatesResolver: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return savedWorkoutTemplates.filter(t => t.userId === parent.id);
}

const exerciseTemplatesResolver: WorkoutTemplateResolvers<Context>['exerciseTemplates'] = (parent) => {
  return savedExerciseTemplates.filter(t => t.workoutTemplateId === parent.id);
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    createWorkoutTemplates: createWorkoutTemplatesResolver,
    updateWorkoutTemplates: updateWorkoutTemplatesResolver,
  },
  User: {
    workoutTemplates: workoutTemplatesResolver,
  },
  WorkoutTemplate: {
    exerciseTemplates: exerciseTemplatesResolver,
  }
}

export default resolvers;
