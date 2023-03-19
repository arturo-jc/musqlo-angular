import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  menuLinks: MenuItem[] = [
    {
      label: 'New Workout',
      routerLink: [ 'workouts', 'new' ],
    },
    {
      label: 'New Schedule',
      routerLink: [ 'schedules', 'new' ],
    },
  ]

  constructor(
    private primeConfig: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
  }
}
