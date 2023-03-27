import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, ViewChild } from '@angular/core';
import { FixedOverlayComponent } from '../../shared/fixed-overlay/fixed-overlay.component';

export type Category = 'Cardio' | 'Back' | 'Legs';

export interface ExerciseItem {
  exerciseType: string;
  category: Category;
}

export const EXERCISES: ExerciseItem[] = [
  {
    exerciseType: 'Aerobics',
    category: 'Cardio',
  },
  {
    exerciseType: 'Deadlift',
    category: 'Back',
  },
  {
    exerciseType: 'Seated Calf Raise',
    category: 'Legs',
  },
  {
    exerciseType: 'Burpees',
    category: 'Cardio',
  },
  {
    exerciseType: 'Turkish Get-Up',
    category: 'Cardio',
  },
];

@Component({
  selector: 'app-exercise-items',
  templateUrl: './exercise-items.component.html',
  styleUrls: ['./exercise-items.component.scss']
})
export class ExerciseItemsComponent {

  @Input() cdkDroplistConnectedTo!: CdkDropList | string;

  @Input() placeholderSetsHidden = false;

  @ViewChild(FixedOverlayComponent) overlay?: FixedOverlayComponent;

  filter = '';

  dragging = false;

  placeholderRefresing = false;

  exercises = EXERCISES;

  exerciseOptions = EXERCISES.map(e => ({
    label: e.exerciseType,
    value: e,
  }));

  hide() {
    if (!this.overlay) { return; }
    this.overlay.hide();
  }

  show() {
    if (!this.overlay) { return; }
    this.overlay.show();
  }

}
