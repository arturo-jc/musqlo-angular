import { Pipe, PipeTransform } from '@angular/core';
import { WorkoutTemplate } from '../mutate-schedule/mutate-schedule.component';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  transform(workout: WorkoutTemplate): string {
    return JSON.stringify({
      title: workout.name,
    })
  }

}
