import { Context } from '../context';
import { MutationResolvers, Resolvers, ScheduleResolvers, UserResolvers } from "../generated/graphql.generated";
import { saveSchedules, savedSchedules } from './schedules.service';
import { savedScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

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

  return saveSchedules(args.schedules, ctx.userId);
}

const updateSchedules: MutationResolvers<Context>['updateSchedules'] = (_parent, _args) => {
  throw new Error('not implemented!');
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
