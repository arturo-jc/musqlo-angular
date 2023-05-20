import { Injectable } from '@angular/core';
import { ExerciseTemplate, FullExerciseTemplateFragment, FullScheduleFragment, FullScheduleWorkoutFragment, FullSetTemplateFragment, FullWorkoutTemplateFragment, Schedule, ScheduleWorkout, SetTemplate, WorkoutTemplate } from '../../generated/graphql.generated';
import { Replace, RequiredBy } from '../shared/utils';

export type FrontendSetTemplate = SetTemplate;

export type FrontendExerciseTemplate = RequiredBy<ExerciseTemplate, 'key' | 'setTemplates'>;

export type FrontendWorkoutTemplate = Replace<WorkoutTemplate, 'exerciseTemplates', FrontendExerciseTemplate[]>;

export type FrontendScheduleWorkout = ScheduleWorkout;

export type FrontendSchedule = Schedule;

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

      if (!workoutTemplate.id) {
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

      if (!exerciseTemplate.id) {
        throw new Error('Backend did not resolve exercise template id');
      }

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
