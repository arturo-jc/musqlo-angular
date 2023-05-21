import { CreateScheduleWorkoutInput, ScheduleWorkout } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';

export type SavedScheduleWorkout = RequiredBy<ScheduleWorkout, 'id' | 'scheduleId'>;

export const savedScheduleWorkouts: SavedScheduleWorkout[] = [];

export function createScheduleWorkouts(scheduleWorkouts: CreateScheduleWorkoutInput[], scheduleId: string): SavedScheduleWorkout[] {

  const output: SavedScheduleWorkout[] = [];

  for (const workout of scheduleWorkouts) {

    const newWorkout: SavedScheduleWorkout = {
      ...workout,
      id: uuid(),
      scheduleId,
    };

    savedScheduleWorkouts.push(newWorkout);

    output.push(newWorkout);
  }

  return output;
}
