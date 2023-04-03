import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WorkoutTemplate, WorkoutTemplatesService } from '../services/workout-templates.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    public workoutTemplates: WorkoutTemplatesService,
    private router: Router,
  ) {}

  editWorkout(template: WorkoutTemplate) {
    this.workoutTemplates.workoutTemplateToEditIndex = this.workoutTemplates.workouts.indexOf(template);
    this.router.navigate([ 'workouts', 'edit' ]);
  }

}
