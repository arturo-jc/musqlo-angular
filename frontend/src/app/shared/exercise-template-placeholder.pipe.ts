import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseItem } from '../../generated/graphql.generated';
import { FrontendExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

@Pipe({
  name: 'exerciseTemplatePlaceholder'
})
export class ExerciseTemplatePlaceholderPipe implements PipeTransform {

  transform(exerciseItem: ExerciseItem): FrontendExerciseTemplate {
    return {
      exerciseType: exerciseItem.exerciseType,
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
