import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { AuthComponent } from './auth/auth.component';
import { checkAuth } from './services/auth.guards';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', canActivate: [ checkAuth ], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'workouts/new', component: MutateWorkoutTemplateComponent },
    { path: 'workouts/edit', component: MutateWorkoutTemplateComponent },
    { path: 'schedules/new', component: MutateScheduleComponent },
    { path: 'schedules/edit', component: MutateScheduleComponent },
    { path: 'login', component: AuthComponent },
    { path: 'signup', component: AuthComponent },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
