import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

export type Category = 'Cardio' | 'Back' | 'Legs';

export interface ExerciseItem {
  exerciseType: string;
  category: Category;
}

@Component({
  selector: 'app-exercise-items',
  templateUrl: './exercise-items.component.html',
  styleUrls: ['./exercise-items.component.scss']
})
export class ExerciseItemsComponent {

  @Input() cdkDroplistConnectedTo!: CdkDropList | string;

  @Input() placeholderSetsHidden = false;

  dragging = false;

  placeholderRefresing = false;

  exercises: ExerciseItem[] = [
    {
      exerciseType: 'Aerobics',
      category: 'Cardio'
    },
    {
      exerciseType: 'Deadlift',
      category: 'Back'
    },
    {
      exerciseType: 'Seated Calf Raise',
      category: 'Legs'
    },
  ];

}
