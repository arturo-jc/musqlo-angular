import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

export type Category = 'Cardio' | 'Back' | 'Legs';

export interface Exercise {
  exerciseType: string;
  category: Category;
}

export interface ExerciseSet {
  reps?: number;
  weight?: number;
  order: number;
}

export interface SetGroup {
  exerciseType: string;
  sets: ExerciseSet[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  exercises: Exercise[] = [
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

  setGroups: SetGroup[] = [];

  drop(event: CdkDragDrop<SetGroup[], Exercise[] | SetGroup[], Exercise | SetGroup>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      return;
    }
    this.insertNewSetGroup((event.item.data) as Exercise, event.currentIndex);
  }

  insertNewSetGroup(exercise: Exercise, index: number) {
    const firstSet: ExerciseSet = {
      order: 1,
    };

    const newSetGroup: SetGroup = {
      exerciseType: exercise.exerciseType,
      sets: [firstSet]
    };

    const clone = [ ...this.setGroups ]; 
    clone.splice(index, 0, newSetGroup);
    this.setGroups = clone;
  }

  addSet(setGroup: SetGroup) {
    const newSet: ExerciseSet = {
      order: setGroup.sets.length + 1,
    };

    setGroup.sets = [ ...setGroup.sets, newSet ];
  }

  reorderSets(setGroup: SetGroup) {
    setGroup.sets.forEach((set, index) => {
      set.order = index + 1;
    });
  }

}
