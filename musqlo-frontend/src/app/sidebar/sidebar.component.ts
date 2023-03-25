import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  menuLinks: MenuItem[] = [
    {
      label: 'New Workout',
      routerLink: [ 'workouts', 'new' ],
      icon: 'pi pi-list'
    },
    {
      label: 'New Schedule',
      routerLink: [ 'schedules', 'new' ],
      icon: 'pi pi-calendar'
    },
  ]

}
