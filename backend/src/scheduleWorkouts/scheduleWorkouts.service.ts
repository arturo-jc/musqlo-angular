import { CreateScheduleWorkoutInput } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { SavedScheduleWorkout } from '../schedules/schedules.service';

export const savedScheduleWorkouts: SavedScheduleWorkout[] = [];

export function createScheduleWorkouts(scheduleWorkouts: CreateScheduleWorkoutInput[]): SavedScheduleWorkout[] {

  const output: SavedScheduleWorkout[] = [];

  for (const workout of scheduleWorkouts) {

    const newWorkout: SavedScheduleWorkout = { ...workout, id: uuid() };

    savedScheduleWorkouts.push(newWorkout);

    output.push(newWorkout);
  }

  return output;
}
