import { Context } from '../context';
import { createExerciseTemplates, deleteExerciseTemplates, savedExerciseTemplates } from '../exerciseTemplates/exerciseTemplates.service';
import { MutationResolvers, Resolvers, UserResolvers, WorkoutTemplateResolvers } from '../generated/graphql.generated';
import { createWorkoutTemplates, savedWorkoutTemplates, updateWorkoutTemplates } from './workoutTemplates.service';

const createWorkoutTemplatesResolver: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  return createWorkoutTemplates(args.workoutTemplates, ctx.userId);
}

const updateWorkoutTemplatesResolver: MutationResolvers<Context>['updateWorkoutTemplates'] = (_parent, args) => {

  const removeExerciseTemplates: string[] = [];

  for (const workoutTemplate of args.workoutTemplates) {

    const {
      addExerciseTemplates,
      removeExerciseTemplates: remove,
      workoutTemplateId,
      ...update
    } = workoutTemplate;

    if (addExerciseTemplates?.length) {
      createExerciseTemplates(addExerciseTemplates, workoutTemplateId);
    }

    if (remove?.length) {
      removeExerciseTemplates.push(...remove);
    }

    updateWorkoutTemplates(workoutTemplateId, update);
  }

  deleteExerciseTemplates(removeExerciseTemplates);

  const workoutTemplateIds = args.workoutTemplates.map(wt => wt.workoutTemplateId);

  return savedWorkoutTemplates.filter(swt => workoutTemplateIds.includes(swt.id));
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
