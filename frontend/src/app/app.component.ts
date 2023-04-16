import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';

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
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
  }
}
