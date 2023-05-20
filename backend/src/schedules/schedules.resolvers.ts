import { Context } from "../context";
import { CreateScheduleWorkoutInput, MutationResolvers, Resolvers, Schedule, ScheduleResolvers, ScheduleWorkout, UserResolvers } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';
import { RequiredBy } from "../utils/types";

export type SavedSchedule = RequiredBy<Schedule, 'id' | 'userId' | 'workoutIds'>;

export type SavedScheduleWorkout = RequiredBy<ScheduleWorkout, 'id'>;

const savedSchedules: SavedSchedule[] = [];

const savedScheduleWorkouts: SavedScheduleWorkout[] = [];

const getSchedules: UserResolvers<Context>['schedules'] = (parent) => {
  return savedSchedules.filter(s => s.userId === parent.id).map(s => ({ ...s, key: s.id }));
}

const workouts: ScheduleResolvers<Context>['workouts'] = (parent, _args, _ctx) => {
  const schedule = savedSchedules.find(s => s.id === parent.id);

  if (!schedule) {
    throw new Error(`Could not resolve schedule: ${parent.id}`);
  }

  return savedScheduleWorkouts.filter(w => schedule.workoutIds.includes(w.id)).map(w => ({ ...w, workoutTemplateKey: w.workoutTemplateId }));
}

const createSchedules: MutationResolvers<Context>['createSchedules'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const output: Schedule[] = [];

  for (const schedule of args.schedules) {

    const savedScheduleWorkouts = saveScheduleWorkouts(schedule.workouts);

    const newSchedule: Schedule = {
      id: uuid(),
      name: schedule.name,
      workouts: savedScheduleWorkouts,
      key: schedule.key,
    };

    output.push(newSchedule);

    if (!newSchedule.id) {
      throw new Error('Cannot save schedule without ID');
    }

    const savedSchedule: SavedSchedule = {
      id: newSchedule.id,
      name: schedule.name,
      userId: ctx.userId,
      workoutIds: savedScheduleWorkouts.map(w => w.id),
    };

    savedSchedules.push(savedSchedule);

  }

  return output;
}

function saveScheduleWorkouts(scheduleWorkouts: CreateScheduleWorkoutInput[]): SavedScheduleWorkout[] {

  const output: SavedScheduleWorkout[] = [];

  for (const workout of scheduleWorkouts) {

    const newWorkout: SavedScheduleWorkout = { ...workout, id: uuid() };

    savedScheduleWorkouts.push(newWorkout);

    output.push(newWorkout);
  }

  return output;
}

const resolvers: Resolvers<Context> = {
  Schedule: {
    workouts,
  },
  User: {
    schedules: getSchedules,
  },
  Mutation: {
    createSchedules,
  },
}

export default resolvers;
