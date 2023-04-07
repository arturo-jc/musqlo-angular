import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primeConfig: PrimeNGConfig,
    public auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.primeConfig.ripple = true;
  }
}
