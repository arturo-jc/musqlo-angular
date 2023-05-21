import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { filter, map, tap, of, partition } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateScheduleInput, CreateSchedulesGQL, CreateSchedulesMutationVariables, CreateScheduleWorkoutInput, UpdateScheduleGQL, UpdateScheduleMutationVariables, UserSchedulesGQL, UserSchedulesQuery, UserSchedulesQueryVariables } from '../../generated/graphql.generated';
import { FrontendSchedule, FrontendService } from '../services/frontend.service';
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
    newSchedule.key = this.currentKey.toString();

    this.currentKey++;

    const updatedSchedules = [ ...this.schedules, newSchedule ];

    this.schedules = updatedSchedules;
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

    // const [ existingScheduleWorkouts, newScheduleWorkouts ] = partition(editedSchedule.workouts || [], sw => sw.id);

    // for (const workout of newScheduleWorkouts) {

    // }
    //

    const mutationVariables: UpdateScheduleMutationVariables = {
      schedules: {
        scheduleId: uneditedSchedule?.id,
        removeWorkouts,
      },
      scheduleWorkouts: [],
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

    const unsavedSchedules: CreateScheduleInput[] = [];

    for (const schedule of this.schedules) {
      if (schedule.id) { continue; }

      if (!schedule.key) {
        throw new Error('Cannot save a schedule without a key');
      }

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

      unsavedSchedules.push(unsavedSchedule);
    }

    if (!unsavedSchedules.length) { return of([]); }

    const mutationVariables: CreateSchedulesMutationVariables = {
      schedules: unsavedSchedules,
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

  get scheduleToEdit() {
    return this.schedules.find(t => t.key === this.editScheduleKey);
  }

  get scheduleToEditIndex() {
    return this.schedules.findIndex(t => t.key === this.editScheduleKey);
  }
}
