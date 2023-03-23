import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { render } from 'preact/compat';

@Component({
  selector: 'app-add-overlay',
  templateUrl: './add-overlay.component.html',
  styleUrls: ['./add-overlay.component.scss'],
      animations: [
        trigger('animation', [
            state(
                'void',
                style({
                    transform: 'scaleY(0.8)',
                    opacity: 0
                })
            ),
            state(
                'close',
                style({
                    opacity: 0
                })
            ),
            state(
                'open',
                style({
                    transform: 'translateY(0)',
                    opacity: 1
                })
            ),
            transition('void => open', animate('.12s cubic-bezier(0, 0, 0.2, 1)')),
            transition('open => close', animate('.12s cubic-bezier(0, 0, 0.2, 1)'))
        ])
    ],
})
export class AddOverlayComponent {

  render = false;

  overlayVisible = false;

  toggleOverlay() {

    if (this.overlayVisible) {
      this.overlayVisible = false;
    } else {
      this.overlayVisible = true;
      this.render = true;
    }

  }

}
