import { Injectable } from '@angular/core';
import { Schedule } from '../../generated/graphql.generated';
import { OptionalId } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor() { }

  schedules: OptionalId<Schedule>[] = [];

  editScheduleKey?: string | null;

  currentKey = 0;

  addSchedule(newSchedule: OptionalId<Schedule>) {
    newSchedule.key = this.currentKey.toString();

    this.currentKey++;

    const updatedSchedules = [ ...this.schedules, newSchedule ];

    this.schedules = updatedSchedules;
  }

  updateSchedule(updatedSchedule: OptionalId<Schedule>) {
    if (!this.editScheduleKey) { return; }

    updatedSchedule.key = this.editScheduleKey.toString();

    const updatedSchedules = [ ...this.schedules ];

    updatedSchedules.splice(this.scheduleToEditIndex, 1, updatedSchedule);

    this.schedules = updatedSchedules;
  }

  get scheduleToEdit() {
    return this.schedules.find(t => t.key === this.editScheduleKey);
  }

  get scheduleToEditIndex() {
    return this.schedules.findIndex(t => t.key === this.editScheduleKey);
  }
}
