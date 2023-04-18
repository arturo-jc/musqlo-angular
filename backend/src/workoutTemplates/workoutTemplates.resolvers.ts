import { Context } from "../context";
import { ExerciseTemplate, MutationResolvers, Resolvers, UserResolvers, WorkoutTemplate } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';

export const workoutTemplates: { [ userId: string ]: WorkoutTemplate[] } = {};

const getWorkoutTemplates: UserResolvers<Context>['workoutTemplates'] = (parent) => {
  return workoutTemplates[parent.id] || [];
}

const createWorkoutTemplates: MutationResolvers<Context>['createWorkoutTemplates'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const existingWorkoutTemplates = workoutTemplates[ctx.userId] || [];

  const newWorkoutTemplates: WorkoutTemplate[] = [];
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

    newWorkoutTemplates.push(newTemplate);

    const copy = { ...newTemplate };

    copy.key = template.key;

    output.push(copy);
  }

  workoutTemplates[ctx.userId] = [ ...existingWorkoutTemplates, ...newWorkoutTemplates];

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
