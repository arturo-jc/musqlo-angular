import { CreateScheduleWorkoutInput, ScheduleWorkout } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';
import { UpdateScheduleWorkoutInput } from '../generated/graphql.generated';

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

export function updateScheduleWorkout(input: UpdateScheduleWorkoutInput) {
  const { scheduleWorkoutId, ...update } = input;

  const scheduleWorkoutIndex = savedScheduleWorkouts.findIndex(sw => sw.id === scheduleWorkoutId);

  const currentValue = savedScheduleWorkouts[scheduleWorkoutIndex];

  if (!currentValue) {
    throw new Error('Schedule workout not found');
  }

  const updatedScheduleWorkout = {
    ...currentValue,
    ...update,
  }

  savedScheduleWorkouts.splice(scheduleWorkoutIndex, 1, updatedScheduleWorkout);

}

