import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workouts/new', component: MutateWorkoutTemplateComponent },
  { path: 'workouts/edit', component: MutateWorkoutTemplateComponent },
  { path: 'schedules/new', component: MutateScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
