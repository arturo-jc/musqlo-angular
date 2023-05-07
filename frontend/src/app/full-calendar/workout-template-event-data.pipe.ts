import { Pipe, PipeTransform } from '@angular/core';
import { FullCalendarService } from '../services/full-calendar.service';
import { FrontendWorkoutTemplate } from '../services/frontend.service';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  constructor(private fullCalendar: FullCalendarService) {}

  transform(workoutTemplate: FrontendWorkoutTemplate): string {
    return JSON.stringify(this.fullCalendar.getEventInput(workoutTemplate));
  }
}
