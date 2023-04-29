import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseItem } from '../../generated/graphql.generated';
import { CollapsableExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

@Pipe({
  name: 'exerciseTemplatePlaceholder'
})
export class ExerciseTemplatePlaceholderPipe implements PipeTransform {

  transform(exerciseItem: ExerciseItem): CollapsableExerciseTemplate {
    return {
      exerciseType: exerciseItem.exerciseType,
      collapsed: false,
      order: 1,
      sets: [
        {
          order: 1,
          reps: 1,
          weight: 0,
        }
      ],
      key: 'placeholder',
    };
  }

}
