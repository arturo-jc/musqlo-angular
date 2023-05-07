import { Injectable } from '@angular/core';
import { ExerciseTemplate, FullExerciseTemplateFragment, FullScheduleFragment, FullScheduleWorkoutFragment, FullSetTemplateFragment, FullWorkoutTemplateFragment, Schedule, ScheduleWorkout, SetTemplate, WorkoutTemplate } from '../../generated/graphql.generated';
import { PartialBy, Replace, RequiredBy } from '../shared/utils';

export type FrontendSetTemplate = PartialBy<SetTemplate, 'id' | 'exerciseTemplateId'>;

export type FrontendExerciseTemplate = Replace<RequiredBy<PartialBy<ExerciseTemplate, 'id' | 'workoutTemplateId'>, 'key'>, 'setTemplates', FrontendSetTemplate[]>;

export type FrontendWorkoutTemplate = Replace<RequiredBy<PartialBy<WorkoutTemplate, 'id' | 'userId'>,'key'>, 'exerciseTemplates', FrontendExerciseTemplate[]>;

export type FrontendScheduleWorkout = PartialBy<ScheduleWorkout, 'id'>;

export type FrontendSchedule = Replace<PartialBy<Schedule, 'id'>, 'workouts', FrontendScheduleWorkout[]>;

@Injectable({
  providedIn: 'root'
})
export class FrontendService {

  constructor() { }

  convertWorkoutTemplates(backendWorkoutTemplates: FullWorkoutTemplateFragment[] | undefined | null, overrideKey?: boolean): FrontendWorkoutTemplate[] {

    const frontendWorkoutTemplates: FrontendWorkoutTemplate[] = [];

    if (!backendWorkoutTemplates) {
      return frontendWorkoutTemplates;
    }

    for (const workoutTemplate of backendWorkoutTemplates) {

      if (!workoutTemplate.key) {
        throw new Error('Backend did not resolve workout template key');
      }

      const frontendWorkoutTemplate: FrontendWorkoutTemplate = {
        id: workoutTemplate.id,
        key: overrideKey ? workoutTemplate.id : workoutTemplate.key,
        name: workoutTemplate.name,
        backgroundColor: workoutTemplate.backgroundColor,
        exerciseTemplates: this.convertExerciseTemplates(workoutTemplate.exerciseTemplates),
      }

      frontendWorkoutTemplates.push(frontendWorkoutTemplate);
    }

    return frontendWorkoutTemplates;
  }

  convertExerciseTemplates(backendExerciseTemplates: FullExerciseTemplateFragment[] | null | undefined): FrontendExerciseTemplate[] {
    const frontendExerciseTemplates: FrontendExerciseTemplate[] = [];

    if (!backendExerciseTemplates) {
      return frontendExerciseTemplates;
    }

    for (const exerciseTemplate of backendExerciseTemplates) {

      const frontendExerciseTemplate: FrontendExerciseTemplate = {
        id: exerciseTemplate.id,
        key: exerciseTemplate.id,
        order: exerciseTemplate.order,
        name: exerciseTemplate.name,
        setTemplates: this.convertSetTemplates(exerciseTemplate.setTemplates),
      }

      frontendExerciseTemplates.push(frontendExerciseTemplate);
    }

    return frontendExerciseTemplates;
  }

  convertSetTemplates(backendSetTemplates: FullSetTemplateFragment[] | null | undefined): FrontendSetTemplate[] {

    const frontendSetTemplates: FrontendSetTemplate[] = [];

    if (!backendSetTemplates) {
      return frontendSetTemplates;
    }

    for (const setTemplate of backendSetTemplates) {

      const frontendSetTemplate: FrontendSetTemplate = {
        id: setTemplate.id,
        order: setTemplate.order,
        weight: setTemplate.weight,
        exerciseType: setTemplate.exerciseType,
        exerciseItemId: setTemplate.exerciseItemId,
      }

      frontendSetTemplates.push(frontendSetTemplate);
    }

    return frontendSetTemplates;
  }

  convertSchedules(backendSchedules: FullScheduleFragment[] | null | undefined): FrontendSchedule[] {

    const frontendSchedules: FrontendSchedule[] = [];

    if (!backendSchedules) {
      return frontendSchedules;
    }

    for (const schedule of backendSchedules) {
      const frontendSchedule: FrontendSchedule = {
        name: schedule.name,
        id: schedule.id,
        key: schedule.id,
        workouts: this.convertScheduleWorkouts(schedule.workouts),
      }

      frontendSchedules.push(frontendSchedule);
    }

    return frontendSchedules;
  }

  convertScheduleWorkouts(backendScheduleWorkouts: FullScheduleWorkoutFragment[] | null | undefined): FrontendScheduleWorkout[] {
    const frontendScheduleWorkouts: FrontendScheduleWorkout[] = [];

    if (!backendScheduleWorkouts) {
      return frontendScheduleWorkouts;
    }

    for (const scheduleWorkout of backendScheduleWorkouts) {
      const frontendScheduleWorkout: FrontendScheduleWorkout = {
        id: scheduleWorkout.id,
        workoutTemplateId: scheduleWorkout.workoutTemplateId,
        workoutTemplateKey: scheduleWorkout.workoutTemplateKey,
        dow: scheduleWorkout.dow,
        allDay: scheduleWorkout.allDay,
        start: scheduleWorkout.start,
        end: scheduleWorkout.end,
      }

      frontendScheduleWorkouts.push(frontendScheduleWorkout);
    }

    return frontendScheduleWorkouts;
  }
}
