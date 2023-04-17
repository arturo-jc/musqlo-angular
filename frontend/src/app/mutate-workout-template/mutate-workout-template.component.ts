import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { ExerciseItem } from '../../generated/graphql.generated';
import { WorkoutTemplate, WorkoutTemplatesService } from '../workout-templates/workout-templates.service';
import { ExerciseItemsComponent } from './exercise-items/exercise-items.component';

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
export class MutateWorkoutTemplateComponent implements OnInit, OnDestroy {

  @ViewChild(ExerciseItemsComponent) exerciseItems?: ExerciseItemsComponent;

  title = 'New Workout';

  color = 'var(--primary-color)';

  mode!: 'create' | 'edit';

  reorderModeButtonPressed = false;

  reorderMode = false;

  exerciseTemplates: ExerciseTemplate[] = [];

  constructor(
    private workoutTemplates: WorkoutTemplatesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setMode();

    if (this.mode === 'edit') {
      this.loadWorkout();
    }
  }

  ngOnDestroy(): void {
    this.workoutTemplates.editWorkoutTemplateKey = undefined;
  }

  setMode() {
    const [ urlFragment ] = this.route.snapshot.url;
    this.mode = urlFragment.path === 'new' ? 'create' : 'edit';
  }

  loadWorkout() {
    const { workoutTemplateToEdit } = this.workoutTemplates;

    if (!workoutTemplateToEdit) { return; }

    this.title = workoutTemplateToEdit.name;
    this.color = workoutTemplateToEdit.backgroundColor;
    this.exerciseTemplates = workoutTemplateToEdit.exercises;
  }

  drop(event: CdkDragDrop<ExerciseTemplate[], ExerciseItem[] | ExerciseTemplate[], ExerciseItem | ExerciseTemplate>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reorderTemplates();
      return;
    }

    this.insertNewTemplate((event.item.data) as ExerciseItem, event.currentIndex);

    if (!this.exerciseItems) { return; }

    this.exerciseItems.show()
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

    const workoutTemplateToSave: WorkoutTemplate = {
      name: this.title,
      exercises: this.exerciseTemplates,
      backgroundColor: this.color,
    }

    if (this.mode === 'create') {
      this.workoutTemplates.addWorkoutTemplate(workoutTemplateToSave);
    } else if (this.mode === 'edit') {
      this.workoutTemplates.updateWorkoutTemplate(workoutTemplateToSave);
    }

    this.router.navigate([ 'dashboard' ]);
  }

}
