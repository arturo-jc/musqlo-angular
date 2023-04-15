import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  get currentTimeSeconds(): number {
    return Math.round(Date.now() / 1000);
  }
}
