import { CreateScheduleInput, Schedule, ScheduleWorkout } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';
import { createScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

export type SavedSchedule = RequiredBy<Schedule, 'id' | 'userId' | 'workoutIds'>;

export type SavedScheduleWorkout = RequiredBy<ScheduleWorkout, 'id'>;

export const savedSchedules: SavedSchedule[] = [];

export function saveSchedules(schedules: CreateScheduleInput[], userId: string): Schedule[] {

  const output: Schedule[] = [];

  for (const schedule of schedules) {

    const savedScheduleWorkouts = createScheduleWorkouts(schedule.workouts);

    const newSchedule: Schedule = {
      id: uuid(),
      name: schedule.name,
      workouts: savedScheduleWorkouts,
      key: schedule.key,
    };

    output.push(newSchedule);

    if (!newSchedule.id) {
      throw new Error('Cannot save schedule without ID');
    }

    const savedSchedule: SavedSchedule = {
      id: newSchedule.id,
      name: schedule.name,
      userId,
      workoutIds: savedScheduleWorkouts.map(w => w.id),
    };

    savedSchedules.push(savedSchedule);
  }

  return output;
}
