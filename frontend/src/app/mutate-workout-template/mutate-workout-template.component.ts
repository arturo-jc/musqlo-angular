import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { ExerciseItem } from '../../generated/graphql.generated';
import { WorkoutTemplatesService } from '../services/workout-templates.service';
import { ExerciseItemsComponent } from './exercise-items/exercise-items.component';
import { FrontendExerciseTemplate, FrontendSetTemplate, FrontendWorkoutTemplate } from '../services/frontend.service';

export const DEFAULT_BG_COLOR = 'var(--primary-color)';

@Component({
  selector: 'app-mutate-workout-template',
  templateUrl: './mutate-workout-template.component.html',
  styleUrls: ['./mutate-workout-template.component.scss'],
})
export class MutateWorkoutTemplateComponent implements OnInit, OnDestroy {

  @ViewChild(ExerciseItemsComponent) exerciseItems?: ExerciseItemsComponent;

  title = 'New Workout';

  color = DEFAULT_BG_COLOR;

  mode!: 'create' | 'edit';

  reorderModeButtonPressed = false;

  reorderMode = false;

  currentKey = 0;

  exerciseTemplates: FrontendExerciseTemplate[] = [];

  collapsedTemplates: { [ templateOrder: string ]: boolean } = {};

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

    if (!workoutTemplateToEdit.name) { return; }

    this.title = workoutTemplateToEdit.name;
    this.color = workoutTemplateToEdit.backgroundColor || DEFAULT_BG_COLOR;

    const exerciseTemplates: FrontendExerciseTemplate[] = [];

    for (const exerciseTemplate of (workoutTemplateToEdit.exerciseTemplates || [])) {

      let key: string;

      if (exerciseTemplate?.id) {
        key = exerciseTemplate.id;
      } else {
        key = this.currentKey.toString();
        this.currentKey++;
      }

      const frontendExercise: FrontendExerciseTemplate = { ...exerciseTemplate, key };

      exerciseTemplates.push(frontendExercise);

      this.collapsedTemplates[frontendExercise.key] = false;
    }

    this.exerciseTemplates = exerciseTemplates;
  }

  drop(
    event: CdkDragDrop< |
      FrontendExerciseTemplate[], ExerciseItem[] |
      FrontendExerciseTemplate[], ExerciseItem |
      FrontendExerciseTemplate
    >
  ) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.reorderTemplates();
      return;
    }

    this.insertNewTemplate((event.item.data) as ExerciseItem, event.currentIndex);

    if (!this.exerciseItems) { return; }

    this.exerciseItems.show()
  }

  insertNewTemplate(exerciseItem: ExerciseItem, index: number) {

    const firstSet: FrontendSetTemplate = {
      exerciseItemId: exerciseItem.id,
      exerciseType: exerciseItem.exerciseType,
      category: exerciseItem.category,
      order: 1,
      weight: 0,
      reps: 1,
    };

    const newTemplate: FrontendExerciseTemplate = {
      name: exerciseItem.exerciseType,
      setTemplates: [ firstSet ],
      order: index + 1,
      key: this.currentKey.toString(),
    };

    this.currentKey++;

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

  addSet(template: FrontendExerciseTemplate) {
    const delay = this.collapsedTemplates[template.key] ? 400 : 0;

    this.collapsedTemplates[template.key] = false;

    setTimeout(() => {
      let lastExistingSet;

      if (template?.setTemplates?.length) {
        lastExistingSet = template.setTemplates[template.setTemplates.length - 1];
      }

      const newSet: FrontendSetTemplate = {
        order: (template?.setTemplates?.length || 0) + 1,
        weight: lastExistingSet?.weight || 0,
        reps: lastExistingSet?.reps || 1,
        exerciseItemId: 'sldk',
      };

      template.setTemplates = [ ...(template.setTemplates || []), newSet ];
    }, delay);
  }

  reorderSets(template: FrontendExerciseTemplate) {
    template?.setTemplates?.forEach((set, index) => {
      if (!set?.order) { return; }
      set.order = index + 1;
    });
  }

  deleteSet(input: { template: FrontendExerciseTemplate, index: number }) {
    const { template, index } = input;

    const updatedTemplates = [ ...(template.setTemplates || []) ];
    updatedTemplates.splice(index, 1);

    if (!updatedTemplates.length) {
      this.deleteTemplate((template.order || 0) - 1);
      return;
    }

    if (template.setTemplates) {
      template.setTemplates = updatedTemplates;
    }

    this.reorderSets(template);
  }

  toggleReorderMode() {
    setTimeout(() => this.reorderMode = !this.reorderMode, 400);
  }

  saveWorkout() {

    const workoutTemplateToSave: FrontendWorkoutTemplate = {
      name: this.title,
      exerciseTemplates: this.exerciseTemplates,
      backgroundColor: this.color,
      key: this.workoutTemplates.currentKey,
    }

    if (this.mode === 'create') {
      this.workoutTemplates.addWorkoutTemplate(workoutTemplateToSave);
    } else if (this.mode === 'edit') {
      this.workoutTemplates.editWorkoutTemplate(workoutTemplateToSave);
    }

    this.router.navigate([ 'dashboard' ]);
  }

}
