import { Pipe, PipeTransform } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { WorkoutTemplate } from '../mutate-schedule/mutate-schedule.component';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  transform(workout: WorkoutTemplate): string {

    // const color = 'var(--primary-color)';

    const event: EventInput = {
      title: workout.name,
      extendedProps: {
        exercises: workout.exercises,
      }
      // backgroundColor: color,
      // borderColor: color,
    }

    return JSON.stringify(event);
  }

}
