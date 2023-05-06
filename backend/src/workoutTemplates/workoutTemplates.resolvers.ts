import { Context } from '../context';
import { MutationResolvers, Resolvers, UserResolvers } from '../generated/graphql.generated';
import { createWorkoutTemplatesAction, savedWorkoutTemplates } from './workoutTemplates.service';

const getWorkoutTemplates: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return savedWorkoutTemplates.filter(t => t.userId === parent.id);
}

const createWorkoutTemplates: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  return createWorkoutTemplatesAction(args.workoutTemplates, ctx.userId);
}

const updateWorkoutTemplates: MutationResolvers<Context>['updateWorkoutTemplates'] = (_parent, args) => {
  const workoutTemplates = savedWorkoutTemplates.filter(w => args.workoutTemplateIds.includes(w.id));

  const { update } = args;

  for (const template of workoutTemplates) {

    if (update.name) {
      template.name = update.name;
    }

    if (update.addExerciseTemplates) {

    }

    if (update.removeExerciseTemplates) {

    }

    // if (edit.exercises) {

    //   const existingExerciseIds: String[] = [];
    //   const newExerciseInputs: EditExerciseInput[] = [];

    //   for (const exercise of edit.exercises) {
    //     if (exercise.id) {
    //       existingExerciseIds.push(exercise.id);
    //     } else {
    //       newExerciseInputs.push(exercise);
    //     }
    //   }

    //   const existingExercises = savedExerciseTemplates.filter(t => existingExerciseIds.includes(t.id));

    //   for (const existingExercise of existingExercises) {
    //     const update = edit.exercises.find(e => e.id === existingExercise.id);

    //     if (!update) { continue; }

    //     existingExercise.order = update.order || existingExercise.order;

    //     if (!update.sets) { continue; }

    //     existingExercise.sets = update.sets || existingExercise.sets;
    //   }

    //   // for (const input of newExerciseInputs) {
    //   //   const newTemplateExercise: SavedExerciseTemplate = {
    //   //     id: uuid(),
    //   //     // exerciseType: input
    //   //   }
    //   // }

    //   // const existingExerciseIds = edit.exercises.reduce((exerciseIds: string[], exercise) => {
    //   //   if (exercise.id) {
    //   //     exerciseIds.push(exercise.id);
    //   //   }
    //   //   return exerciseIds;
    //   // }, [])

    //   // const exerciseTemplateIds = edit.exercises.map()
    //   // const exercises = savedExerciseTemplates.filter(t => t.id === edit.exercises.)

    // }

    // if (exercises) {

    // }

  }

  return [];
}

const resolvers: Resolvers<Context> = {
  User: {
    workoutTemplates: getWorkoutTemplates,
  },
  Mutation: {
    createWorkoutTemplates,
    updateWorkoutTemplates,
  },
}

export default resolvers;
