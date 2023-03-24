import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FixedOverlayComponent } from '../shared/fixed-overlay/fixed-overlay.component';

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
  collapsed?: boolean;
}

@Component({
  selector: 'app-mutate-workout-template',
  templateUrl: './mutate-workout-template.component.html',
  styleUrls: ['./mutate-workout-template.component.scss'],
})
export class MutateWorkoutTemplateComponent {

  @ViewChild(FixedOverlayComponent) fixedOverlay?: FixedOverlayComponent;

  reorderModeButtonPressed = false;

  reorderMode = false;

  dragging = false;

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
      this.reorderTemplates();
      return;
    }

    this.insertNewTemplate((event.item.data) as ExerciseItem, event.currentIndex);

    if (!this.fixedOverlay) { return; }

    this.fixedOverlay.show()
  }

  insertNewTemplate(exercise: ExerciseItem, index: number) {
    const firstSet: SetTemplate = {
      order: 1,
      weight: 0,
      reps: 1,
    };

    const newTemplate: ExerciseTemplate = {
      exerciseType: exercise.exerciseType,
      sets: [ firstSet ],
      order: index + 1,
      collapsed: false,
    };

    const updatedTemplates = [ ...this.exerciseTemplates ]; 
    updatedTemplates.splice(index, 0, newTemplate);
    this.exerciseTemplates = updatedTemplates;
    this.reorderTemplates();
  }

  reorderTemplates() {
    this.exerciseTemplates.forEach((group, index) => {
      group.order = index + 1;
    })
    this.exerciseTemplates = cloneDeep(this.exerciseTemplates);
  }

  deleteTemplate(index: number) {
    const updatedTemplates = [ ...this.exerciseTemplates ];
    updatedTemplates.splice(index, 1);
    this.exerciseTemplates = updatedTemplates;
    this.reorderTemplates();
  }

  addSet(template: ExerciseTemplate) {
    const delay = template.collapsed ? 400 : 0;

    template.collapsed = false;

    setTimeout(() => {
      let lastExistingSet;

      if (template.sets.length) {
        lastExistingSet = template.sets[template.sets.length - 1];
      }

      const newSet: SetTemplate = {
        order: template.sets.length + 1,
        weight: lastExistingSet?.weight || 0,
        reps: lastExistingSet?.reps || 1,
      };

      template.sets = [ ...template.sets, newSet ];
    }, delay);
  }

  reorderSets(template: ExerciseTemplate) {
    template.sets.forEach((set, index) => {
      set.order = index + 1;
    });
  }

  deleteSet(input: { template: ExerciseTemplate, index: number }) {
    const { template, index } = input;

    const updatedTemplates = [ ...template.sets ];
    updatedTemplates.splice(index, 1);

    if (!updatedTemplates.length) {
      this.deleteTemplate(template.order - 1);
      return;
    }

    template.sets = updatedTemplates;
    this.reorderSets(template);
  }

  toggleReorderMode() {
    setTimeout(() => this.reorderMode = !this.reorderMode, 400);
  }

  saveWorkout() {
    console.warn('saveWorkout not implemeted');
  }

}
