import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Schedule, WorkoutTemplate } from '../../generated/graphql.generated';
import { SchedulesService } from '../services/schedules.service';
import { OptionalId } from '../shared/utils';
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

  editWorkout(workoutTemplate: OptionalId<WorkoutTemplate>) {
    if (!workoutTemplate.key) { return; }
    this.workoutTemplatesService.editWorkoutTemplateKey = workoutTemplate.key;
    this.router.navigate([ 'workouts', 'edit' ]);
  }

  editSchedule(schedule: OptionalId<Schedule>) {
    this.schedulesService.editScheduleKey = schedule.key;
    this.router.navigate([ 'schedules', 'edit' ]);
  }

}
