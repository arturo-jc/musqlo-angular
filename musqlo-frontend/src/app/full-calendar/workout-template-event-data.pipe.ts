import { Pipe, PipeTransform } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { WorkoutTemplate } from '../mutate-schedule/mutate-schedule.component';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  transform(workout: WorkoutTemplate): string {

    const event: EventInput = {
      title: workout.name,
      extendedProps: {
        exercises: workout.exercises,
      },
      backgroundColor: workout.backgroundColor,
      borderColor: workout.backgroundColor,
    }

    return JSON.stringify(event);
  }

}