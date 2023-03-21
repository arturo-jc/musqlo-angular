import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseItem, ExerciseTemplate } from './mutate-workout-template/mutate-workout-template.component';

@Pipe({
  name: 'exerciseTemplatePlaceholder'
})
export class ExerciseTemplatePlaceholderPipe implements PipeTransform {

  transform(exerciseItem: ExerciseItem): ExerciseTemplate {
    return {
      exerciseType: exerciseItem.exerciseType,
      collapsed: false,
      order: 1,
      sets: [
        {
          order: 1,
          reps: undefined,
          weight: undefined,
        }
      ],
    };
  }

}