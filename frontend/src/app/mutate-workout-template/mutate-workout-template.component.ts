import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { ExerciseItem } from '../../generated/graphql.generated';
import { WorkoutTemplatesService } from '../services/workout-templates.service';
import { AuthService } from '../services/auth.service';
import { ExerciseItemsComponent } from './exercise-items/exercise-items.component';
import { FrontendExerciseTemplate, FrontendSetTemplate, FrontendWorkoutTemplate } from '../services/frontend.service';
import { combineLatest, firstValueFrom, map } from 'rxjs';

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

  loadedworkoutTemplateKey?: string | null;

  reorderModeButtonPressed = false;

  reorderMode = false;

  currentKey = 0;

  exerciseTemplates: FrontendExerciseTemplate[] = [];

  collapsedTemplates: { [ templateOrder: string ]: boolean } = {};

  constructor(
    private auth: AuthService,
    private workoutTemplates: WorkoutTemplatesService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.checkIfExistingWorkoutTemplate();
  }

  ngOnDestroy(): void {
    this.workoutTemplates.activeWorkoutTemplate = undefined;
  }

  async checkIfExistingWorkoutTemplate() {

    const workoutTemplateId$ = this.route.params.pipe(map(params => params['workoutTemplateId']));

    const userId$ = this.auth.user.pipe(map(user => user?.id));

    const [ workoutTemplateId, userId ] = await firstValueFrom(combineLatest([ workoutTemplateId$, userId$ ]));

    const isExistingWorkoutTemplate = Boolean(workoutTemplateId);

    if (isExistingWorkoutTemplate && userId) {

      this.setMode(isExistingWorkoutTemplate);

    } else if (isExistingWorkoutTemplate) {
      throw new Error('You need to be logged in to access a workout template');
    } else {

      this.setMode(isExistingWorkoutTemplate);

      if (this.mode === 'edit') {
        this.setWorkoutTemplate();
      }

    }
  }

  setMode(isExistingWorkoutTemplate: boolean) {

    if (isExistingWorkoutTemplate) {
      this.mode = 'edit';
      return;
    }

    const [ urlFragment ] = this.route.snapshot.url;
    this.mode = urlFragment.path === 'new' ? 'create' : 'edit';
  }

  setWorkoutTemplate() {
    const { activeWorkoutTemplate } = this.workoutTemplates;

    if (!activeWorkoutTemplate) {
      throw new Error('Active workout template not found');
    }

    if (!activeWorkoutTemplate.name) {
      throw new Error('Active workout template must have a name')
    }

    this.title = activeWorkoutTemplate.name;
    this.color = activeWorkoutTemplate.backgroundColor || DEFAULT_BG_COLOR;

    this.loadedworkoutTemplateKey = activeWorkoutTemplate.key;

    const exerciseTemplates: FrontendExerciseTemplate[] = [];

    for (const exerciseTemplate of (activeWorkoutTemplate.exerciseTemplates)) {

      let key: string;

      if (exerciseTemplate?.id) {
        key = exerciseTemplate.id;
      } else {
        key = this.currentKey.toString();
        this.currentKey++;
      }

      const setTemplates = [ ...exerciseTemplate.setTemplates ]
        .sort((a, b) => a.order - b.order);

      const frontendExercise: FrontendExerciseTemplate = {
        ...exerciseTemplate,
        key,
        setTemplates,
      };

      exerciseTemplates.push(frontendExercise);

      this.collapsedTemplates[frontendExercise.key] = false;
    }

    this.exerciseTemplates = exerciseTemplates
      .sort((a, b) => a.order - b.order);
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
    for (let i = 0; i < this.exerciseTemplates.length; i++) {

      const exerciseTemplate = this.exerciseTemplates[i];

      exerciseTemplate.order = i + 1;
    }

    this.exerciseTemplates = cloneDeep(this.exerciseTemplates);
  }

  deleteTemplate(index: number) {
    const updatedTemplates = [ ...this.exerciseTemplates ];
    updatedTemplates.splice(index, 1);
    this.exerciseTemplates = updatedTemplates;
    this.reorderTemplates();
  }

  addSet(template: FrontendExerciseTemplate) {

    if (!template?.setTemplates?.length) {
      throw new Error('Cannot add set templates if exercise template has no other set templates');
    }

    const lastExistingSet = template.setTemplates[template.setTemplates.length - 1];

    const delay = this.collapsedTemplates[template.key] ? 400 : 0;

    this.collapsedTemplates[template.key] = false;

    setTimeout(() => {

      const newSet: FrontendSetTemplate = {
        order: template.setTemplates.length + 1,
        weight: lastExistingSet.weight,
        reps: lastExistingSet.reps,
        exerciseItemId: lastExistingSet.exerciseItemId,
      };

      template.setTemplates = [ ...(template.setTemplates || []), newSet ];
    }, delay);
  }

  reorderSets(template: FrontendExerciseTemplate) {
    if (!template.setTemplates) { return; }

    template.setTemplates.forEach((t, i) => t.order = i + 1);
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
      key: this.loadedworkoutTemplateKey || this.workoutTemplates.currentKey,
    }

    if (this.mode === 'create') {
      this.workoutTemplates.addWorkoutTemplate(workoutTemplateToSave);
    } else if (this.mode === 'edit') {
      this.workoutTemplates.editWorkoutTemplate(workoutTemplateToSave);
    }

    this.router.navigate([ 'dashboard' ]);
  }

}
