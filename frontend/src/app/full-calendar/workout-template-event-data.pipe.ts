import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutTemplate } from '../../generated/graphql.generated';
import { OptionalId } from '../shared/utils';
import { FullCalendarService } from './full-calendar.service';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  constructor(private fullCalendar: FullCalendarService) {}

  transform(workoutTemplate: OptionalId<WorkoutTemplate>): string {
    return JSON.stringify(this.fullCalendar.getEventInput(workoutTemplate));
  }
}
