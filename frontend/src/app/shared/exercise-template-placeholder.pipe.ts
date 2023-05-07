import { Pipe, PipeTransform } from '@angular/core';
import { ExerciseItem } from '../../generated/graphql.generated';
import { FrontendExerciseTemplate } from '../services/frontend.service';

@Pipe({
  name: 'exerciseTemplatePlaceholder'
})
export class ExerciseTemplatePlaceholderPipe implements PipeTransform {

  transform(exerciseItem: ExerciseItem): FrontendExerciseTemplate {
    return {
      name: exerciseItem.exerciseType,
      order: 1,
      workoutTemplateId: '',
      setTemplates: [
        {
          exerciseItemId: exerciseItem.id,
          order: 1,
          reps: 1,
          weight: 0,
        }
      ],
      key: 'placeholder',
    };
  }

}
