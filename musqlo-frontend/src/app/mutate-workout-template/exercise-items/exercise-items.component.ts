import { CdkDropList } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';

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

  @ViewChild(InputText) inputTextRef?: InputText;

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

  setFocus() {
    if (!this.inputTextRef) { return; }
    setTimeout(() => this.inputTextRef?.el.nativeElement.focus(), 0);
  }
}
