import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';

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

  @ViewChild(OverlayPanel) overlayPanel?: OverlayPanel;

  @ViewChild('buttonRef') buttonRef?: ElementRef<HTMLButtonElement>;

  overlayVisible = false;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  show() {
    if (!this.buttonRef) { return; }
    this.buttonRef.nativeElement.click();
  }

  hide() {
    if (!this.overlayPanel) { return; }
    this.overlayPanel.hide();
  }

  forwardOnShow() {
    this.overlayVisible = true;
    this.fixOverlay();
    this.onShow.emit();
  }

  forwardOnHide() {
    this.overlayVisible = false;
    this.onHide.emit();
  }

  fixOverlay() {
    const overlay = this.document.body.querySelector('.p-overlaypanel') as HTMLElement;
    overlay.style.setProperty('position', 'fixed');
  }

}
