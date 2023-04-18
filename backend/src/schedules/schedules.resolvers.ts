import { Context } from "../context";
import { MutationResolvers, Resolvers, Schedule, ScheduleResolvers, UserResolvers } from "../generated/graphql.generated";

const schedules: { [ userId: string ]: Schedule[] } = {};

const getSchedules: UserResolvers<Context>['schedules'] = (parent) => {
  return schedules[parent.id] || [];
}

const workouts: ScheduleResolvers<Context>['workouts'] = (_parent, _args, _ctx) => {
  return [];
}

const createSchedules: MutationResolvers<Context>['createSchedules'] = (_parent, _args, _ctx) => {
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
  },
}

export default resolvers;
