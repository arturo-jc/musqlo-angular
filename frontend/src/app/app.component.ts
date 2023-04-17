import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';
import { WorkoutTemplatesService } from './workout-templates/workout-templates.service';

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

  constructor(
    private primeConfig: PrimeNGConfig,
    public auth: AuthService,
    private workoutTemplates: WorkoutTemplatesService,
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
    this.auth.onAuthSuccess.subscribe(user => this.onAuthSuccess(user.id))
  }

  onAuthSuccess(userId: string) {
    this.workoutTemplates.createUnsavedWorkoutTemplates(userId);
  }
}
