import { Context } from '../context';
import { MutationResolvers, Resolvers, ScheduleResolvers, UserResolvers } from "../generated/graphql.generated";
import { saveSchedules, savedSchedules } from './schedules.service';
import { savedScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

const getSchedules: UserResolvers<Context>['schedules'] = (parent) => {
  return savedSchedules.filter(s => s.userId === parent.id).map(s => ({ ...s, key: s.id }));
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

  const removeScheduleWorkouts: string[] = [];

  for (const schedule of args.schedules) {

    const {
      addWorkouts,
      removeWorkouts: remove,
      ...update
    } = schedule;

    if (addWorkouts?.length) {

    }

    if (remove?.length) {
      removeScheduleWorkouts.push(...remove);
    }
  }

  return [];
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
