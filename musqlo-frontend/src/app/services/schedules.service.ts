import { Injectable } from '@angular/core';

export interface ScheduleWorkout {
  workoutTemplateKey?: number;
  dow: number;
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

  currentKey = 0;

  addSchedule(newSchedule: Schedule) {
    newSchedule.key = this.currentKey;
    this.currentKey++;
    const updatedSchedules = [ ...this.schedules, newSchedule ];
    this.schedules = updatedSchedules;
  }

}
