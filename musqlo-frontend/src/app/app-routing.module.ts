import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';

const routes: Routes = [
  { path: 'workouts/new', component: MutateWorkoutTemplateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
