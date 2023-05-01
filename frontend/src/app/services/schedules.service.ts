import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { cloneDeep } from 'lodash-es';
import { filter, map, of, tap } from 'rxjs';
import { SubSink } from 'subsink';
import { CreateScheduleInput, CreateSchedulesGQL, CreateSchedulesMutationVariables, CreateScheduleWorkoutInput, Schedule, UserSchedulesGQL, UserSchedulesQuery, UserSchedulesQueryVariables } from '../../generated/graphql.generated';
import { OptionalId } from '../shared/utils';
import { WorkoutTemplatesService } from './workout-templates.service';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(
    private workoutTemplates: WorkoutTemplatesService,
    private userSchedulesGQL: UserSchedulesGQL,
    private createSchedulesGQL: CreateSchedulesGQL,
  ) { }

  schedules: OptionalId<Schedule>[] = [];

  editScheduleKey?: string | null;

  currentKey = 0;

  userSchedulesQuery?: QueryRef<UserSchedulesQuery, UserSchedulesQueryVariables>;

  subs = new SubSink();

  addSchedule(newSchedule: OptionalId<Schedule>) {
    newSchedule.key = this.currentKey.toString();

    this.currentKey++;

    const updatedSchedules = [ ...this.schedules, newSchedule ];

    this.schedules = updatedSchedules;
  }

  updateSchedule(updatedSchedule: OptionalId<Schedule>) {

    if (!this.editScheduleKey) { return; }

    updatedSchedule.key = this.editScheduleKey.toString();

    const updatedSchedules = [ ...this.schedules ];

    updatedSchedules.splice(this.scheduleToEditIndex, 1, updatedSchedule);

    this.schedules = updatedSchedules;
  }

  watchUserSchedules(userId: string) {
    const watchQueryVariables: UserSchedulesQueryVariables = { userId };

    this.userSchedulesQuery = this.userSchedulesGQL.watch(watchQueryVariables, { fetchPolicy: 'cache-and-network' });

    this.subs.sink = this.userSchedulesQuery.valueChanges.pipe(
      filter(res => !res.loading),
      map(res => cloneDeep(res.data.user?.schedules) || []),
      tap(userSchedules => this.setKeys(userSchedules)),
    ).subscribe(userSchedules => this.schedules = userSchedules);
  }

  setKeys(userSchedules: Schedule[]) {
    for (const schedule of userSchedules) {
      schedule.key = schedule.id;
      schedule.workouts = schedule.workouts?.map(w => ({ ...w, workoutTemplateKey: w.workoutTemplateId }));
    }
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

    return this.createSchedulesGQL.mutate(mutationVariables)
      .pipe(
        filter(res => !res.loading),
        map(res => res.data?.createSchedules || []),
        tap(userSchedules => this.schedules = userSchedules),
      );
  }

  reset() {
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
