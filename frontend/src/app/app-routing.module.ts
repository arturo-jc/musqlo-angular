import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { AuthComponent } from './auth/auth.component';
import { checkAuth, isAuthenticated, isDeauthenticated } from './services/auth.guards';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', canActivate: [ checkAuth ], children: [
    { path: 'dashboard', component: DashboardComponent, canActivate: [ isAuthenticated ] },
    { path: 'workouts/new', component: MutateWorkoutTemplateComponent, canActivate: [ isAuthenticated ] },
    { path: 'workouts/edit', component: MutateWorkoutTemplateComponent, canActivate: [ isAuthenticated ] },
    { path: 'schedules/new', component: MutateScheduleComponent, canActivate: [ isAuthenticated ] },
    { path: 'schedules/edit', component: MutateScheduleComponent, canActivate: [ isAuthenticated ] },
    { path: 'login', component: AuthComponent, canActivate: [ isDeauthenticated ] },
    { path: 'signup', component: AuthComponent, canActivate: [ isDeauthenticated ] },
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
