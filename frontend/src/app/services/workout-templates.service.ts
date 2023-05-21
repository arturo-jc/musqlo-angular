import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { partition } from 'lodash-es';
import { filter, map, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateWorkoutTemplatesGQL, UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables, CreateWorkoutTemplatesMutationVariables, CreateWorkoutTemplateInput, UserWorkoutTemplatesGQL, CreateExerciseTemplateInput, CreateSetTemplateInput, UpdateWorkoutTemplateGQL, UpdateExerciseTemplateInput, UpdateWorkoutTemplateMutationVariables, UpdateSetTemplateInput } from '../../generated/graphql.generated';
import { FrontendExerciseTemplate, FrontendService, FrontendSetTemplate, FrontendWorkoutTemplate } from '../services/frontend.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutTemplatesService {

  userId?: string | null;

  workoutTemplates: FrontendWorkoutTemplate[] = []

  editWorkoutTemplateKey?: string;

  _currentKey = 0;

  userWorkoutTemplatesQuery?: QueryRef<UserWorkoutTemplatesQuery, UserWorkoutTemplatesQueryVariables>;

  subs = new SubSink();

  constructor(
    private createWorkoutTemplatesGQL: CreateWorkoutTemplatesGQL,
    private userWorkoutTemplatesGQL: UserWorkoutTemplatesGQL,
    private updateWorkoutTemplateGQL: UpdateWorkoutTemplateGQL,
    private frontend: FrontendService,
  ) {}

  addWorkoutTemplate(newWorkoutTemplate: FrontendWorkoutTemplate) {

    if (this.userId) {
      this.createWorkoutTemplate(newWorkoutTemplate);
      return;
    }

    const updatedWorkoutTemplates = [ ...this.workoutTemplates, newWorkoutTemplate ];

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  createWorkoutTemplate(newWorkoutTemplate: FrontendWorkoutTemplate) {

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: this.getCreateWorkoutTemplateInput([ newWorkoutTemplate ]),
    };

    this.createWorkoutTemplatesGQL.mutate(mutationVariables).subscribe();
  }

  editWorkoutTemplate(editedWorkoutTemplate: FrontendWorkoutTemplate) {

    if (this.userId) {
      this.updateExistingWorkoutTemplate(editedWorkoutTemplate);
      return;
    }

    if (this.editWorkoutTemplateKey === undefined) {
      throw new Error('No editWorkoutTemplateKey found');
    }

    editedWorkoutTemplate.key = this.editWorkoutTemplateKey;

    const updatedWorkoutTemplates = [ ...this.workoutTemplates ];

    updatedWorkoutTemplates.splice(this.workoutTemplateToEditIndex, 1, editedWorkoutTemplate);

    this.workoutTemplates = updatedWorkoutTemplates;
  }

  updateExistingWorkoutTemplate(editedWorkoutTemplate: FrontendWorkoutTemplate) {

    const uneditedWorkoutTemplate = this.workoutTemplateToEdit;

    if (!uneditedWorkoutTemplate) {
      throw new Error('workoutTemplateToEdit not found');
    }

    if (!uneditedWorkoutTemplate.id) {
      throw new Error('Cannot update workout template without an ID');
    }

    const exerciseTemplateIds: string[] = [];

    const setTemplateIds: string[] = [];

    for (const exerciseTemplate of editedWorkoutTemplate.exerciseTemplates) {

      for (const setTemplate of exerciseTemplate.setTemplates) {

        if (!setTemplate.id) { continue; }

        setTemplateIds.push(setTemplate.id);
      }

      if (!exerciseTemplate.id) { continue; }

      exerciseTemplateIds.push(exerciseTemplate.id);
    }

    const removeExerciseTemplates: string[] = [];

    for (const exerciseTemplate of uneditedWorkoutTemplate.exerciseTemplates) {

      if (!exerciseTemplate.id || exerciseTemplateIds.includes(exerciseTemplate.id)) { continue; }

      removeExerciseTemplates.push(exerciseTemplate.id);
    }

    const [ existingExerciseTemplates, newExerciseTemplates ] = partition(editedWorkoutTemplate.exerciseTemplates, e => e.id);

    const updateExerciseTemplateInputs: UpdateExerciseTemplateInput[] = [];

    const modifiedSetTemplates: FrontendSetTemplate[] = [];

    for (const editedExerciseTemplate of existingExerciseTemplates) {

      if (!editedExerciseTemplate.id) {
        throw new Error('Cannot update exercise template without an ID');
      }

      const uneditedExerciseTemplate = uneditedWorkoutTemplate.exerciseTemplates.find(t => t.id === editedExerciseTemplate.id);

      if (!uneditedExerciseTemplate) { continue; }

      const removeSetTemplates: string[] = [];

      for (const setTemplate of uneditedExerciseTemplate.setTemplates) {

        if (!setTemplate.id || setTemplateIds.includes(setTemplate.id)) { continue; }

        removeSetTemplates.push(setTemplate.id);
      }

      const [ existingSetTemplates, newSetTemplates ] = partition(editedExerciseTemplate.setTemplates, st => st.id);

      updateExerciseTemplateInputs.push({
        exerciseTemplateId: editedExerciseTemplate.id,
        order: editedExerciseTemplate.order,
        addSetTemplates: this.getCreateSetTemplateInput(newSetTemplates),
        removeSetTemplates,
      });

      modifiedSetTemplates.push(...existingSetTemplates);
    }

    const updateSetTemplateInputs: UpdateSetTemplateInput[] = [];

    for (const modifiedSetTemplate of modifiedSetTemplates) {

      if (!modifiedSetTemplate.id) { continue; }

      updateSetTemplateInputs.push({
        setTemplateId: modifiedSetTemplate.id,
        order: modifiedSetTemplate.order,
        weight: modifiedSetTemplate.weight,
        reps: modifiedSetTemplate.reps,
      })

    }

    const mutationVariables: UpdateWorkoutTemplateMutationVariables = {
      workoutTemplates: [
        {
          workoutTemplateId: uneditedWorkoutTemplate.id,
          name: editedWorkoutTemplate.name,
          backgroundColor: editedWorkoutTemplate.backgroundColor,
          removeExerciseTemplates,
          addExerciseTemplates: this.getCreateExerciseTemplateInput(newExerciseTemplates),
        }
      ],
      exerciseTemplates: updateExerciseTemplateInputs,
      setTemplates: updateSetTemplateInputs,
    }

    this.updateWorkoutTemplateGQL.mutate(mutationVariables).subscribe();
  }

  onAuthSuccess(userId: string) {
    this.userId = userId;

    const watchQueryVariables: UserWorkoutTemplatesQueryVariables = { userId };

    this.userWorkoutTemplatesQuery = this.userWorkoutTemplatesGQL.watch(watchQueryVariables, { fetchPolicy: 'cache-and-network' });

    this.subs.sink = this.userWorkoutTemplatesQuery.valueChanges.pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertWorkoutTemplates(res.data.user?.workoutTemplates, true)),
    ).subscribe(userWorkoutTemplates =>  this.workoutTemplates = userWorkoutTemplates);
  }

  setKeys(workoutTemplates: { key?: string | null | undefined; id: string }[]) {
    for (const template of workoutTemplates) {
      template.key = template.id;
    }
  }

  createUnsavedWorkoutTemplates() {

    const unsavedWorkoutTemplates = this.workoutTemplates.filter(t => !t.id);

    if (!unsavedWorkoutTemplates.length) { return of([]); }

    const mutationVariables: CreateWorkoutTemplatesMutationVariables = {
      workoutTemplates: this.getCreateWorkoutTemplateInput(unsavedWorkoutTemplates),
    };

    return this.createWorkoutTemplatesGQL.mutate(mutationVariables).pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertWorkoutTemplates(res.data?.createWorkoutTemplates)),
      tap(newWorkoutTemplates => this.workoutTemplates = newWorkoutTemplates)
    );
  }

  getCreateWorkoutTemplateInput(workoutTemplates: FrontendWorkoutTemplate[]): CreateWorkoutTemplateInput[] {
    const output: CreateWorkoutTemplateInput[] = [];

    for (const workoutTemplate of workoutTemplates) {

      if (workoutTemplate.id) {
        throw new Error('Cannot create an already existing workout template');
      }

      if (!workoutTemplate.key) {
        throw new Error('Cannot save a workout template without a key');
      }

      const createWorkoutTemplateInput: CreateWorkoutTemplateInput = {
        backgroundColor: workoutTemplate.backgroundColor,
        exerciseTemplates: this.getCreateExerciseTemplateInput(workoutTemplate.exerciseTemplates),
        key: workoutTemplate.key,
        name: workoutTemplate.name,
      };

      output.push(createWorkoutTemplateInput)
    }

    return output;
  }

  getCreateExerciseTemplateInput(exerciseTemplates: FrontendExerciseTemplate[]): CreateExerciseTemplateInput[] {
    const output: CreateExerciseTemplateInput[] = [];

    for (const exerciseTemplate of exerciseTemplates) {

      const createExerciseTemplateInput: CreateExerciseTemplateInput = {
        name: exerciseTemplate.name,
        order: exerciseTemplate.order,
        setTemplates: this.getCreateSetTemplateInput(exerciseTemplate.setTemplates),
      }

      output.push(createExerciseTemplateInput);
    }

    return output;
  }

  getCreateSetTemplateInput(setTemplates: FrontendSetTemplate[]): CreateSetTemplateInput[] {
    const output: CreateSetTemplateInput[] = [];

    for (const setTemplate of setTemplates) {

      const createSetTemplateInput: CreateSetTemplateInput = {
        exerciseItemId: setTemplate?.exerciseItemId,
        order: setTemplate.order,
        reps: setTemplate.reps,
        weight: setTemplate.weight,
      }

      output.push(createSetTemplateInput);
    }

    return output;
  }

  reset() {
    this.userId = null;
    this.workoutTemplates = [];
    this.editWorkoutTemplateKey = undefined;
    this._currentKey = 0;
    this.subs.unsubscribe();
  }

  get workoutTemplateToEdit() {
    return this.workoutTemplates.find(t => t.key === this.editWorkoutTemplateKey);
  }

  get workoutTemplateToEditIndex() {
    return this.workoutTemplates.findIndex(t => t.key === this.editWorkoutTemplateKey);
  }

  get currentKey() {
    const output = this._currentKey.toString();
    this._currentKey++;
    return output;
  }

}
