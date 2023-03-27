import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { DomHandler } from 'primeng/dom';

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
    this.realignOverlay(this.overlayPanel?.container, this.overlayPanel?.target);
    this.onShow.emit();
  }

  forwardOnHide() {
    this.overlayVisible = false;
    this.onHide.emit();
  }

  realignOverlay(element: any, target: any): void {
    const elementDimensions = element.offsetParent ?
      { width: element.offsetWidth, height: element.offsetHeight } :
      DomHandler.getHiddenElementDimensions(element);
    const elementOuterHeight = elementDimensions.height;
    const elementOuterWidth = elementDimensions.width;
    const targetOuterHeight = target.offsetHeight;
    const targetOuterWidth = target.offsetWidth;
    const targetOffset = target.getBoundingClientRect();
    const windowScrollTop = DomHandler.getWindowScrollTop();
    const windowScrollLeft = DomHandler.getWindowScrollLeft();
    const viewport = DomHandler.getViewport();
    let top: number, left: number;

    if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
      // top = targetOffset.top + windowScrollTop - elementOuterHeight;
      top = targetOffset.top - elementOuterHeight;
      element.style.transformOrigin = 'bottom';

      if (top < 0) {
        top = windowScrollTop;
      }
    } else {
      top = targetOuterHeight + targetOffset.top + windowScrollTop;
      element.style.transformOrigin = 'top';
    }

    if (targetOffset.left + elementOuterWidth > viewport.width) left = Math.max(0, targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth);
    else left = targetOffset.left + windowScrollLeft;

    element.style.top = top + 'px';
    element.style.left = left + 'px';
    element.style.position = 'fixed';
  }

}
