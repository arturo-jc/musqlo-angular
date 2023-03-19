import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';

const routes: Routes = [
  { path: 'workouts/new', component: MutateWorkoutTemplateComponent },
  { path: 'schedules/new', component: MutateScheduleComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
