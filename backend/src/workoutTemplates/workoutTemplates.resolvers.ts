import { Context } from "../context";
import { ExerciseTemplate, MutationResolvers, Resolvers, UserResolvers, WorkoutTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';

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

const resolvers: Resolvers<Context> = {
  User: {
    workoutTemplates: getWorkoutTemplates,
  },
  Mutation: {
    createWorkoutTemplates,
  },
}

export default resolvers;
