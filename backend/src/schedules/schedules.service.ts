import { CreateScheduleWorkoutInput, Schedule, ScheduleWorkout } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';
import { savedScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

export type SavedSchedule = RequiredBy<Schedule, 'id' | 'userId' | 'workoutIds'>;

export type SavedScheduleWorkout = RequiredBy<ScheduleWorkout, 'id'>;

export const savedSchedules: SavedSchedule[] = [];

export function saveScheduleWorkouts(scheduleWorkouts: CreateScheduleWorkoutInput[]): SavedScheduleWorkout[] {

  const output: SavedScheduleWorkout[] = [];

  for (const workout of scheduleWorkouts) {

    const newWorkout: SavedScheduleWorkout = { ...workout, id: uuid() };

    savedScheduleWorkouts.push(newWorkout);

    output.push(newWorkout);
  }

  return output;
}
