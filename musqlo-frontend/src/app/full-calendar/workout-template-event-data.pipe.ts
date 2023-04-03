import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutTemplate } from '../services/workout-templates.service';
import { FullCalendarService } from './full-calendar.service';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  constructor(private fullCalendar: FullCalendarService) {}

  transform(workoutTemplate: WorkoutTemplate): string {
    return JSON.stringify(this.fullCalendar.getEventInput(workoutTemplate));
  }
}
