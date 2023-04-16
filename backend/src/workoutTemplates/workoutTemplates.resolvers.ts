import { User } from '../auth/auth.resolvers';
import { Context } from '../context';
import { v1 as uuid } from 'uuid';

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
  backgroundColor: string;
}

export interface ExerciseTemplate {
  exerciseType: string;
  sets: SetTemplate[];
  order: number;
}

export interface SetTemplate {
  reps?: number;
  weight?: number;
  order: number;
}

export interface SetTemplate {
  reps?: number;
  weight?: number;
  order: number;
}

export interface CreateWorkoutTemplateInput {
  name: string;
  exercises: CreateExerciseInput[];
  backgroundColor?: string;
}

export interface CreateExerciseInput {
  exerciseType: string;
  sets: CreateSetTemplateInput[];
  order: number;
}

export interface CreateSetTemplateInput {
  reps?: number;
  weight?: number;
  order: number;
}

const workoutTemplates: { [ userId: string ]: WorkoutTemplate[]} = {};

async function listWorkoutTemplates(root: User): Promise<WorkoutTemplate[]>{
  console.log(root);
  return workoutTemplates[root.id] || [];
}

async function createWorkoutTemplates(_root: undefined, args: { workoutTemplates: CreateSetTemplateInput[]}, ctx: Context): Promise<WorkoutTemplate[]> {
  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  return workoutTemplates[ctx.userId] || [];
}

export default {
  User: {
    workoutTemplates: listWorkoutTemplates,
  },
  Mutation: {
    createWorkoutTemplates,
  }
}
