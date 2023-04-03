import { Injectable } from '@angular/core';

export interface Schedule {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor() { }

  schedules: Schedule[] = [];

  createSchedule(newSchedule: Schedule) {

  }
}
