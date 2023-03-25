import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FixedFilterComponent } from '../../shared/fixed-filter/fixed-filter.component';

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

  @ViewChild(FixedFilterComponent) fixedFilter?: FixedFilterComponent<ExerciseItem>;

  filter = '';

  dragging = false;

  placeholderRefresing = false;

  exercises: ExerciseItem[] = [
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

  filteredExercises: ExerciseItem[] = [];

  setFilteredExercises(filteredExercises: ExerciseItem[]) {
    this.filteredExercises = filteredExercises;
  }

  hide() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.hide();
  }

  show() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.show();
  }

}
