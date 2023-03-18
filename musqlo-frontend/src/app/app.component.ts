import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

export type Category = 'Cardio' | 'Back' | 'Legs';

export interface ExerciseItem {
  exerciseType: string;
  category: Category;
}

export interface SetTemplate {
  reps?: number;
  weight?: number;
  order: number;
}

export interface ExerciseTemplate {
  exerciseType: string;
  sets: SetTemplate[];
  order: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

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

  exerciseTemplates: ExerciseTemplate[] = [];

  drop(event: CdkDragDrop<ExerciseTemplate[], ExerciseItem[] | ExerciseTemplate[], ExerciseItem | ExerciseTemplate>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reorderGroups();
      return;
    }
    this.insertGroup((event.item.data) as ExerciseItem, event.currentIndex);
  }

  insertGroup(exercise: ExerciseItem, index: number) {
    const firstSet: SetTemplate = {
      order: 1,
    };

    const newSetGroup: ExerciseTemplate = {
      exerciseType: exercise.exerciseType,
      sets: [firstSet],
      order: this.exerciseTemplates.length + 1,
    };

    const updatedSetGroups = [ ...this.exerciseTemplates ]; 
    updatedSetGroups.splice(index, 0, newSetGroup);
    this.exerciseTemplates = updatedSetGroups;
  }

  reorderGroups() {
    this.exerciseTemplates.forEach((group, index) => {
      group.order = index + 1;
    })
  }

  deleteTemplate(index: number) {
    const updatedGroups = [ ...this.exerciseTemplates ];
    updatedGroups.splice(index, 1);
    this.exerciseTemplates = updatedGroups;
    this.reorderGroups();
  }

  addSet(setGroup: ExerciseTemplate) {
    const newSet: SetTemplate = {
      order: setGroup.sets.length + 1,
    };

    setGroup.sets = [ ...setGroup.sets, newSet ];
  }

  reorderSets(setGroup: ExerciseTemplate) {
    setGroup.sets.forEach((set, index) => {
      set.order = index + 1;
    });
  }

  deleteSet(setGroup: ExerciseTemplate, index: number) {
    const updatedSets = [ ...setGroup.sets ];
    updatedSets.splice(index, 1);

    if (!updatedSets.length) {
      this.deleteTemplate(setGroup.order - 1);
      return;
    }

    setGroup.sets = updatedSets;
    this.reorderSets(setGroup);
  }

}
