import { Pipe, PipeTransform } from '@angular/core';
import { EventInput } from '@fullcalendar/core';
import { WorkoutTemplate, WorkoutTemplatesService } from '../services/workout-templates.service';
import { LIGHT_DARK_THRESHOLD } from '../shared/color-picker/color-picker.component';

@Pipe({
  name: 'workoutTemplateEventData'
})
export class WorkoutTemplateEventDataPipe implements PipeTransform {

  constructor(private workoutTemplates: WorkoutTemplatesService) {}

  transform(workout: WorkoutTemplate): string {


    const event: EventInput = {
      title: workout.name,
      extendedProps: {
        index: this.workoutTemplates.workoutTemplates.indexOf(workout),
      },
      backgroundColor: workout.backgroundColor,
      borderColor: workout.backgroundColor,
      textColor: this.getTextColor(workout),
    }

    return JSON.stringify(event);
  }

  getTextColor(workout: WorkoutTemplate): string {

    const lightTextColor = 'var(--gray-50)';
    const darkTextColor = 'var(--gray-800)';

    const consecutiveNumbersRegex = new RegExp(/[.*!\d](\d+)[.*!\d]/g);

    const regexMatches = workout.backgroundColor.match(consecutiveNumbersRegex);

    const bgColorIntensity = regexMatches?.length ? Number(regexMatches[0]) : undefined;

    const isBgColorDark = (bgColorIntensity && bgColorIntensity > LIGHT_DARK_THRESHOLD) || workout.backgroundColor.includes('--primary-color');

    const textColor = isBgColorDark ? lightTextColor : darkTextColor;

    return textColor;
  }

}
