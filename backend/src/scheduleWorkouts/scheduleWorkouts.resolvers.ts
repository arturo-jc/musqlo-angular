import { Context } from '../context';
import { MutationResolvers, Resolvers } from '../generated/graphql.generated';
import { savedScheduleWorkouts, updateScheduleWorkout } from './scheduleWorkouts.service';

const updateScheduleWorkouts: MutationResolvers<Context>['updateScheduleWorkouts'] = (_parent, args) => {

  for (const scheduleWorkout of args.scheduleWorkouts) {
    updateScheduleWorkout(scheduleWorkout);
  }

  const scheduleWorkoutIds = args.scheduleWorkouts.map(sw => sw.scheduleWorkoutId);

  return savedScheduleWorkouts.filter(sw => scheduleWorkoutIds.includes(sw.id));
}

const resolvers: Resolvers<Context> = {
  Mutation: {
    updateScheduleWorkouts,
  },
}

export default resolvers;
