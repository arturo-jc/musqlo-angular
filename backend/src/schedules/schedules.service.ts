import { CreateScheduleInput, Schedule } from '../generated/graphql.generated';
import { v1 as uuid } from 'uuid';
import { RequiredBy } from '../utils/types';
import { createScheduleWorkouts } from '../scheduleWorkouts/scheduleWorkouts.service';

export type SavedSchedule = RequiredBy<Schedule, 'id' | 'userId'>;

export const savedSchedules: SavedSchedule[] = [];

export function saveSchedules(schedules: CreateScheduleInput[], userId: string): Schedule[] {

  const output: Schedule[] = [];

  for (const schedule of schedules) {

    const newSchedule: Schedule = {
      id: uuid(),
      name: schedule.name,
      key: schedule.key,
    };

    output.push(newSchedule);

    if (!newSchedule.id) {
      throw new Error('Cannot save schedule without ID');
    }

    createScheduleWorkouts(schedule.workouts, newSchedule.id);

    const savedSchedule: SavedSchedule = {
      id: newSchedule.id,
      name: schedule.name,
      userId,
    };

    savedSchedules.push(savedSchedule);
  }

  return output;
}

export function updateSchedule(scheduleId: string, update: any) {

}
