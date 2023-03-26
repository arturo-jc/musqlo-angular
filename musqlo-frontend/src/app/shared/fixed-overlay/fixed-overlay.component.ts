import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fixed-overlay',
  templateUrl: './fixed-overlay.component.html',
  styleUrls: ['./fixed-overlay.component.scss'],
  animations: [
    trigger('buttonRotate', [
      state('close', style({})),
      state('open', style({ transform: 'rotate(45deg)' })),
      transition('open <=> close', animate('.12s cubic-bezier(0, 0, 0.2, 1)'))
    ])
  ],
})
export class FixedOverlayComponent {
  @Output() onShow = new EventEmitter();

  @Output() onHide = new EventEmitter();

  @ViewChild('overlayRef') overlay?: ElementRef;

  overlayVisible = false;

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

  show() {
    this.overlayVisible = true;
    this.onShow.emit();
  }

  hide() {
    this.overlayVisible = false;
    this.onHide.emit();
  }

}
