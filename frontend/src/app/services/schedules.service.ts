import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { filter, map, tap, of } from 'rxjs';
import { partition } from 'lodash-es';
import { SubSink } from 'subsink';
import { CreateScheduleInput, CreateSchedulesGQL, CreateSchedulesMutationVariables, CreateScheduleWorkoutInput, UpdateScheduleGQL, UpdateScheduleMutationVariables, UpdateScheduleWorkoutInput, UserSchedulesGQL, UserSchedulesQuery, UserSchedulesQueryVariables } from '../../generated/graphql.generated';
import { FrontendSchedule, FrontendScheduleWorkout, FrontendService } from '../services/frontend.service';
import { WorkoutTemplatesService } from './workout-templates.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(
    private workoutTemplates: WorkoutTemplatesService,
    private userSchedulesGQL: UserSchedulesGQL,
    private createSchedulesGQL: CreateSchedulesGQL,
    private updateScheduleGQL: UpdateScheduleGQL,
    private frontend: FrontendService,
  ) { }

  userId?: string | null;

  schedules: FrontendSchedule[] = [];

  editScheduleKey?: string | null;

  currentKey = 0;

  userSchedulesQuery?: QueryRef<UserSchedulesQuery, UserSchedulesQueryVariables>;

  subs = new SubSink();

  addSchedule(newSchedule: FrontendSchedule) {

    if (this.userId) {
      this.createSchedule(newSchedule);
      return;
    }

    newSchedule.key = this.currentKey.toString();

    this.currentKey++;

    const updatedSchedules = [ ...this.schedules, newSchedule ];

    this.schedules = updatedSchedules;
  }

  createSchedule(newSchedule: FrontendSchedule) {

    const mutationVariables: CreateSchedulesMutationVariables = {
      schedules: this.getCreateScheduleInput([ newSchedule ]),
    }

    this.createSchedulesGQL.mutate(mutationVariables).subscribe();
  }

  updateSchedule(updatedSchedule: FrontendSchedule) {

    if (this.userId) {
      this.updateExistingSchedule(updatedSchedule);
      return;
    }

    if (!this.editScheduleKey) { return; }

    updatedSchedule.key = this.editScheduleKey.toString();

    const updatedSchedules = [ ...this.schedules ];

    updatedSchedules.splice(this.scheduleToEditIndex, 1, updatedSchedule);

    this.schedules = updatedSchedules;
  }

  updateExistingSchedule(editedSchedule: FrontendSchedule) {

    const uneditedSchedule = this.scheduleToEdit;

    if (!uneditedSchedule?.id) {
      throw new Error('Cannot update schedule without an ID');
    }

    const scheduleWorkoutIds: string[] = [];

    for (const workout of editedSchedule.workouts || []) {

      if (!workout.id) { continue; }

      scheduleWorkoutIds.push(workout.id);
    }

    const removeWorkouts: string[] = [];

    for (const workout of uneditedSchedule?.workouts || []) {

      if (!workout.id || scheduleWorkoutIds.includes(workout.id)) { continue; }

      removeWorkouts.push(workout.id);
    }

    const [ existingScheduleWorkouts, newScheduleWorkouts ] = partition(editedSchedule.workouts || [], sw => sw.id);

    const updateScheduleWorkoutInputs: UpdateScheduleWorkoutInput[] = [];

    for (const existingScheduleWorkout of existingScheduleWorkouts) {

      if (!existingScheduleWorkout.id) {
        throw new Error('Cannot update schedule workout without an ID');
      }

      const updateScheduleWorkout: UpdateScheduleWorkoutInput = {
        scheduleWorkoutId: existingScheduleWorkout.id,
        allDay: existingScheduleWorkout.allDay,
        dow: existingScheduleWorkout.dow,
        start: existingScheduleWorkout.start,
        end: existingScheduleWorkout.end,
      }

      updateScheduleWorkoutInputs.push(updateScheduleWorkout);
    }

    const addWorkouts: CreateScheduleWorkoutInput[] = newScheduleWorkouts
      .map(sw => ({
        allDay: sw.allDay,
        dow: sw.dow,
        start: sw.start,
        end: sw.end,
        workoutTemplateId: sw.workoutTemplateId,
      }))

    const mutationVariables: UpdateScheduleMutationVariables = {
      schedules: {
        scheduleId: uneditedSchedule.id,
        name: editedSchedule.name,
        removeWorkouts,
        addWorkouts,
      },
      scheduleWorkouts: updateScheduleWorkoutInputs,
    }

    this.updateScheduleGQL.mutate(mutationVariables).subscribe();
  }

  onAuthSuccess(userId: string) {

    this.userId = userId;

    const watchQueryVariables: UserSchedulesQueryVariables = { userId };

    this.userSchedulesQuery = this.userSchedulesGQL.watch(watchQueryVariables, { fetchPolicy: 'cache-and-network' });

    this.subs.sink = this.userSchedulesQuery.valueChanges.pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertSchedules(res.data.user?.schedules)),
    ).subscribe(userSchedules => this.schedules = userSchedules);
  }

  createUnsavedSchedules() {

    const unsavedSchedules = this.schedules.filter(s => !s.id);

    if (!unsavedSchedules.length) { return of([]); }

    unsavedSchedules.forEach(s => {
      if (!s.key) {
        throw new Error('Cannot save schedule without a key');
      }
    })

    const mutationVariables: CreateSchedulesMutationVariables = {
      schedules: this.getCreateScheduleInput(unsavedSchedules),
    }

    return this.createSchedulesGQL.mutate(mutationVariables).pipe(
      filter(res => !res.loading),
      map(res => this.frontend.convertSchedules(res.data?.createSchedules)),
      tap(newSchedules => this.schedules = newSchedules)
    );
  }

  reset() {
    this.userId = null;
    this.schedules = [];
    this.editScheduleKey = undefined;
    this.currentKey = 0;
    this.subs.unsubscribe();
  }

  getCreateScheduleInput(schedules: FrontendSchedule[]): CreateScheduleInput[] {

    const output: CreateScheduleInput[] = [];

    for (const schedule of schedules) {

      const unsavedScheduleWorkouts: CreateScheduleWorkoutInput[] = [];

      for (const workout of schedule.workouts || []) {

        const workoutTemplateId = this.workoutTemplates.workoutTemplates.find(t => t.key === workout.workoutTemplateKey)?.id;

        const unsavedScheduleWorkout: CreateScheduleWorkoutInput = {
          allDay: workout.allDay,
          dow: workout.dow,
          start: workout.start,
          end: workout.end,
          workoutTemplateId,
        };

        unsavedScheduleWorkouts.push(unsavedScheduleWorkout);
      }

      const unsavedSchedule: CreateScheduleInput = {
        name: schedule.name,
        workouts: unsavedScheduleWorkouts,
        key: schedule.key,
      }

      output.push(unsavedSchedule);
    }

    return output;
  }

  get scheduleToEdit() {
    return this.schedules.find(t => t.key === this.editScheduleKey);
  }

  get scheduleToEditIndex() {
    return this.schedules.findIndex(t => t.key === this.editScheduleKey);
  }
}
