import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { RecursivePartial } from '../shared/utils';
import { FullCalendarService } from '../services/full-calendar.service';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  constructor(private fullCalendar: FullCalendarService) {}

  transform(workoutTemplate: RecursivePartial<WorkoutTemplate>): string {
    return JSON.stringify(this.fullCalendar.getEventInput(workoutTemplate));
  }
}
