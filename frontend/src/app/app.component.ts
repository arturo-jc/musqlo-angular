import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { firstValueFrom, switchMap } from 'rxjs';
import { SubSink } from 'subsink';
import { AuthService } from './services/auth.service';
import { SchedulesService } from './services/schedules.service';
import { WorkoutTemplatesService } from './services/workout-templates.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  topbarItems: MenuItem[] = [
    {
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logOut()
    ,}
  ];

  subs = new SubSink();

  constructor(
    private primeConfig: PrimeNGConfig,
    public auth: AuthService,
    private router: Router,
    private workoutTemplates: WorkoutTemplatesService,
    private schedules: SchedulesService,
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
    this.auth.onAuthSuccess.subscribe(user => this.onAuthSuccess(user.id))
    this.auth.onLogout.subscribe(() => this.onLogout());
  }

  async onAuthSuccess(userId: string) {
    await firstValueFrom(this.workoutTemplates.createUnsavedWorkoutTemplates())
    await firstValueFrom(this.schedules.createUnsavedSchedules());
    this.workoutTemplates.watchUserWorkoutTemplates(userId);
    this.schedules.watchUserSchedules(userId);
  }

  onLogout() {
    this.workoutTemplates.reset();
    this.schedules.reset();
    this.auth.reset();
    this.router.navigate([ '/login' ]);
  }
}
