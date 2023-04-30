import { Injectable } from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { filter, map, switchMap, tap } from 'rxjs';
import { CreateScheduleInput, CreateSchedulesGQL, CreateSchedulesMutationVariables, CreateScheduleWorkoutInput, Schedule, UserSchedulesGQL, UserSchedulesQuery, UserSchedulesQueryVariables } from '../../generated/graphql.generated';
import { OptionalId } from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class SchedulesService {

  constructor(
    private createSchedulesGQL: CreateSchedulesGQL,
    private userSchedulesGQL: UserSchedulesGQL,
  ) { }

  schedules: OptionalId<Schedule>[] = [];

  editScheduleKey?: string | null;

  currentKey = 0;

  userSchedulesQuery?: QueryRef<UserSchedulesQuery, UserSchedulesQueryVariables>;

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

  createUnsavedSchedules(userId: string) {

    const unsavedSchedules: CreateScheduleInput[] = [];

    for (const schedule of this.schedules) {
      if (schedule.id) { continue; }

      if (!schedule.key) {
        throw new Error('Cannot save a schedule without a key');
      }

      const unsavedScheduleWorkouts: CreateScheduleWorkoutInput[] = schedule.workouts;

      const unsavedSchedule: CreateScheduleInput = {
        name: schedule.name,
        workouts: unsavedScheduleWorkouts,
      }

      unsavedSchedules.push(unsavedSchedule);
    }

    const mutationVariables: CreateSchedulesMutationVariables = {
      schedules: unsavedSchedules,
    }

    const userSchedulesQueryVariables: UserSchedulesQueryVariables = { userId };

    this.userSchedulesQuery = this.userSchedulesGQL.watch(userSchedulesQueryVariables);

    const { valueChanges: queryValueChanges } = this.userSchedulesQuery;

    return this.createSchedulesGQL.mutate(mutationVariables)
      .pipe(
        switchMap(() => queryValueChanges),
          filter(res => !res.loading),
          map(res => res.data.user?.schedules || []),
          tap(userSchedules => {
            this.schedules = userSchedules;
            this.currentKey = 0;
        }));
  }

  get scheduleToEdit() {
    return this.schedules.find(t => t.key === this.editScheduleKey);
  }

  get scheduleToEditIndex() {
    return this.schedules.findIndex(t => t.key === this.editScheduleKey);
  }
}
