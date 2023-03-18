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
  order: number;
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
      this.reorderGroups();
      return;
    }
    this.insertGroup((event.item.data) as Exercise, event.currentIndex);
  }

  insertGroup(exercise: Exercise, index: number) {
    const firstSet: ExerciseSet = {
      order: 1,
    };

    const newSetGroup: SetGroup = {
      exerciseType: exercise.exerciseType,
      sets: [firstSet],
      order: this.setGroups.length + 1,
    };

    const updatedSetGroups = [ ...this.setGroups ]; 
    updatedSetGroups.splice(index, 0, newSetGroup);
    this.setGroups = updatedSetGroups;
  }

  reorderGroups() {
    this.setGroups.forEach((group, index) => {
      group.order = index + 1;
    })
  }

  deleteGroup(index: number) {
    const updatedGroups = [ ...this.setGroups ];
    updatedGroups.splice(index, 1);
    this.setGroups = updatedGroups;
    this.reorderGroups();
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

  deleteSet(setGroup: SetGroup, index: number) {
    const updatedSets = [ ...setGroup.sets ];
    updatedSets.splice(index, 1);

    if (!updatedSets.length) {
      this.deleteGroup(setGroup.order - 1);
      return;
    }

    setGroup.sets = updatedSets;
    this.reorderSets(setGroup);
  }

}
