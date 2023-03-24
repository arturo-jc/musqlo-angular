import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';

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
export class ExerciseItemsComponent implements OnInit {

  @Input() cdkDroplistConnectedTo!: CdkDropList | string;

  @Input() placeholderSetsHidden = false;

  filter = '';

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

  filteredExercises: ExerciseItem[] = [];

  ngOnInit(): void {
    this.filterExercises();
  }

  filterExercises() {
    this.filteredExercises = this.exercises.filter(exercise => {
      const noFilter = !this.filter.trim().length;
      const exerciseIncluded = exercise.exerciseType.toLowerCase().includes(this.filter.trim().toLowerCase());
      return noFilter || exerciseIncluded;
    });
  }
}
