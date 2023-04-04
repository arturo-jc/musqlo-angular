import { Injectable } from '@angular/core';

export interface ScheduleWorkout {
  workoutTemplateKey?: number;
  dow: number;
  allDay: boolean;
  start?: string;
  end?: string;
}

export interface Schedule {
  name: string;
  workouts: ScheduleWorkout[];
  key?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor() { }

  schedules: Schedule[] = [];

  editScheduleKey?: number;

  currentKey = 0;

  addSchedule(newSchedule: Schedule) {
    newSchedule.key = this.currentKey;
    this.currentKey++;
    const updatedSchedules = [ ...this.schedules, newSchedule ];
    this.schedules = updatedSchedules;
  }

  updateSchedule(updatedSchedule: Schedule) {
    updatedSchedule.key = this.editScheduleKey;
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
