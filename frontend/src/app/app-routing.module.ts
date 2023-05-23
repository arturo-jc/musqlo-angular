import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { AuthComponent } from './auth/auth.component';
import { checkAuth, isDeauthenticated } from './services/auth.guards';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', canActivate: [ checkAuth ], children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'workouts', children: [
      { path: 'new', component: MutateWorkoutTemplateComponent },
      { path: 'edit', component: MutateWorkoutTemplateComponent },
      { path: 'edit/:workoutTemplateId', component: MutateWorkoutTemplateComponent },
    ]},
    { path: 'schedules', children: [
      { path: 'new', component: MutateScheduleComponent },
      { path: 'edit', component: MutateScheduleComponent },
      { path: 'edit/:scheduleId', component: MutateScheduleComponent },
    ] },
    { path: 'login', component: AuthComponent, canActivate: [ isDeauthenticated ] },
    { path: 'signup', component: AuthComponent, canActivate: [ isDeauthenticated ] },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
