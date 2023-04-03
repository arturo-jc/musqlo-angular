import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulesService } from '../services/schedules.service';
import { WorkoutTemplate, WorkoutTemplatesService } from '../services/workout-templates.service';

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

  editWorkout(template: WorkoutTemplate) {
    this.workoutTemplatesService.workoutTemplateToEditIndex = this.workoutTemplatesService.workoutTemplates.indexOf(template);
    this.router.navigate([ 'workouts', 'edit' ]);
  }

}
