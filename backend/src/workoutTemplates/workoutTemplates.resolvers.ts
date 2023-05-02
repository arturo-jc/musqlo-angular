import { Context } from "../context";
import { EditExerciseInput, ExerciseTemplate, MutationResolvers, Resolvers, UserResolvers, WorkoutTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';
import { savedExerciseTemplates } from '../exerciseTemplates/exerciseTemplates.resolvers';

export interface UserTemplates {
  userId: string;
  workoutTemplates: WorkoutTemplate[];
}

export type SavedWorkoutTemplate = WorkoutTemplate & { userId: string };

export const savedWorkoutTemplates: SavedWorkoutTemplate[] = [];

const getWorkoutTemplates: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return savedWorkoutTemplates.filter(t => t.userId === parent.id);
}

const createWorkoutTemplates: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const output: WorkoutTemplate[] = [];

  for (const template of args.workoutTemplates) {

    const newTemplateExercises: ExerciseTemplate[] = template.exercises
      .map(e => ({
        id: uuid(),
        exerciseType: e.exerciseType,
        sets: e.sets,
        order: e.order,
      }))

    const newTemplate: WorkoutTemplate = {
      id: uuid(),
      name: template.name,
      exercises: newTemplateExercises,
      backgroundColor: template.backgroundColor,
    }

    output.push({ ...newTemplate, key: template.key });

    savedWorkoutTemplates.push({ ...newTemplate, userId: ctx.userId });
  }

  return output;
}

const editWorkoutTemplates: MutationResolvers<Context>['editWorkoutTemplates'] = (_parent, args) => {
  const workoutTemplates = savedWorkoutTemplates.filter(w => args.workoutTemplateIds.includes(w.id));

  const { edit } = args;

  for (const template of workoutTemplates) {

    if (edit.name) {
      template.name = edit.name;
    }

    if (edit.exercises) {

      const existingExerciseIds: String[] = [];
      const newExerciseInputs: EditExerciseInput[] = [];

      for (const exercise of edit.exercises) {
        if (exercise.id) {
          existingExerciseIds.push(exercise.id);
        } else {
          newExerciseInputs.push(exercise);
        }
      }

      const existingExercises = savedExerciseTemplates.filter(t => existingExerciseIds.includes(t.id));

      for (const existingExercise of existingExercises) {
        const update = edit.exercises.find(e => e.id === existingExercise.id);

        if (!update) { continue; }

        existingExercise.order = update.order || existingExercise.order;

        if (!update.sets) { continue; }

        existingExercise.sets = update.sets || existingExercise.sets;
      }

      // for (const input of newExerciseInputs) {
      //   const newTemplateExercise: SavedExerciseTemplate = {
      //     id: uuid(),
      //     // exerciseType: input
      //   }
      // }

      // const existingExerciseIds = edit.exercises.reduce((exerciseIds: string[], exercise) => {
      //   if (exercise.id) {
      //     exerciseIds.push(exercise.id);
      //   }
      //   return exerciseIds;
      // }, [])

      // const exerciseTemplateIds = edit.exercises.map()
      // const exercises = savedExerciseTemplates.filter(t => t.id === edit.exercises.)

    }

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
    editWorkoutTemplates,
  },
}

export default resolvers;
