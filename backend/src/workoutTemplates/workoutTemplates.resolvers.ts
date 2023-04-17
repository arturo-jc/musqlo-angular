import { Context } from "../context";
import { ExerciseTemplate, MutationResolvers, Resolvers, UserResolvers, WorkoutTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';

const workoutTemplates: { [ userId: string ]: WorkoutTemplate[]} = {};

const getWorkoutTemplates: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return workoutTemplates[parent.id] || [];
}

const createWorkoutTemplates: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const newWorkoutTemplates: WorkoutTemplate[] = [];

  for (const template of args.workoutTemplates) {

    const newTemplateExercises: ExerciseTemplate[] = template.exercises
      .map(e => ({
        id: uuid(),
        exerciseType: e.exerciseType,
        sets: e.sets,
      }))

    const newTemplate: WorkoutTemplate = {
      id: uuid(),
      name: template.name,
      exercises: newTemplateExercises,
      backgroundColor: template.backgroundColor,
    }

    newWorkoutTemplates.push(newTemplate);
  }

  workoutTemplates[ctx.userId] = newWorkoutTemplates;

  return newWorkoutTemplates;
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
