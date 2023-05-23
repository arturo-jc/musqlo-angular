import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash-es';
import { FrontendSchedule, FrontendWorkoutTemplate } from '../services/frontend.service';
import { SchedulesService } from '../services/schedules.service';
import { WorkoutTemplatesService } from '../services/workout-templates.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    public workoutTemplatesService: WorkoutTemplatesService,
    public schedulesService: SchedulesService,
    private router: Router,
  ) {}

  editWorkout(workoutTemplate: FrontendWorkoutTemplate) {

    const navCommands = [ 'workouts', 'edit' ];

    if (workoutTemplate.id) {

      // If workout template is saved, push it to URL so we can fetch it from mutate component
      navCommands.push(workoutTemplate.id);

    } else {

      //Otherwise, store it in `activeWorkoutTemplate` so we can still load it from mutate component
      this.workoutTemplatesService.activeWorkoutTemplate = cloneDeep(workoutTemplate);
    }

    this.router.navigate(navCommands);
  }

  editSchedule(schedule: FrontendSchedule) {

    const navCommands = [ 'schedules', 'edit' ];

    if (schedule.id) {
      navCommands.push(schedule.id);
    } else {
      this.schedulesService.activeSchedule = schedule;
    }

    this.router.navigate(navCommands);
  }

}
