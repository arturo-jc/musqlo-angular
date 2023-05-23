import { Context } from '../context';
import { MutationResolvers, Resolvers, ScheduleResolvers, UserResolvers } from "../generated/graphql.generated";
import { saveSchedules, savedSchedules, updateSchedule } from './schedules.service';
import { createScheduleWorkouts, deleteScheduleWorkouts, savedScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

const getSchedules: UserResolvers<Context>['schedules'] = (parent, args) => {

  let userSchedules = savedSchedules.filter(s => s.userId === parent.id);

  if (args.filter?.scheduleIds?.length) {
    userSchedules = userSchedules.filter(s => args.filter?.scheduleIds?.includes(s.id));
  }

  return userSchedules;
}

const workouts: ScheduleResolvers<Context>['workouts'] = (parent, _args, _ctx) => {
  return savedScheduleWorkouts.filter(sw => sw.scheduleId === parent.id);
}

const createSchedules: MutationResolvers<Context>['createSchedules'] = (_parent, args, ctx) => {

  if (!ctx.userId) {
    throw new Error('User not authenticated');
  }

  return saveSchedules(args.schedules, ctx.userId);
}

const updateSchedules: MutationResolvers<Context>['updateSchedules'] = (_parent, args) => {

  const deleteScheduleWorkoutIds: string[] = [];

  for (const schedule of args.schedules) {

    const {
      addWorkouts,
      removeWorkouts,
      ...update
    } = schedule;

    if (addWorkouts?.length) {
      createScheduleWorkouts(addWorkouts, update.scheduleId);
    }

    if (removeWorkouts?.length) {
      deleteScheduleWorkoutIds.push(...removeWorkouts);
    }

    updateSchedule(update);
  }

  deleteScheduleWorkouts(deleteScheduleWorkoutIds);

  const scheduleIds = args.schedules.map(s => s.scheduleId);

  return savedSchedules.filter(s => scheduleIds.includes(s.id));
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
    updateSchedules,
  },
}

export default resolvers;
