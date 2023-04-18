import { Context } from "../context";
import { MutationResolvers, Resolvers, Schedule, ScheduleResolvers, UserResolvers } from "../generated/graphql.generated";
import { v1 as uuid } from 'uuid';
// import { workoutTemplates } from "../workoutTemplates/workoutTemplates.resolvers";
// import { flatten } from 'lodash';

export type StorageSchedule = Omit<Schedule, 'workouts'> & { workoutIds: string[] }

const schedules: { [ userId: string ]: StorageSchedule[] } = {};

// const scheduleWorkouts: any[] = [];

const getSchedules: UserResolvers<Context>['schedules'] = (parent) => {
  const userSchedules = schedules[parent.id] || [];

  const output: Schedule[] = userSchedules.map(s => ({
    id: s.id,
    name: s.name,
  }));

  return output;
}

const workouts: ScheduleResolvers<Context>['workouts'] = (_parent, _args, _ctx) => {
  // const allSchedules = flatten(Object.values(schedules));
  // const parentSchedule = allSchedules.find(s => s.id === parent.id);
  // const workoutIds = parentSchedule?.workoutIds;

  // const allWorkoutTemplates = flatten(Object.values(workoutTemplates));
  // return allWorkoutTemplates.filter(w => workoutIds?.includes(w.id));
  return [];
}

const createSchedules: MutationResolvers<Context>['createSchedules'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  const existingSchedules = schedules[ctx.userId] || [];

  const newSchedules: StorageSchedule[] = [];
  const output: Schedule[] = [];

  for (const schedule of args.schedules) {

    const newSchedule: Schedule = {
      id: uuid(),
      name: schedule.name,
    };

    const storageSchedule: StorageSchedule = {
      ...newSchedule,
      workoutIds: schedule.workouts.map(w => w.workoutTemplateId),
    };

    newSchedules.push(storageSchedule);
    output.push(newSchedule);
  }

  schedules[ctx.userId] = [ ...existingSchedules, ...newSchedules ];

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
