import { Component, Input } from '@angular/core';

export const COLOR_NAMES = [
  'blue',
  'green',
  'yellow',
  'cyan',
  'pink',
  'indigo',
  'teal',
  'orange',
  'bluegray',
  'purple',
  'red',
  'primary'
];

export const COLOR_NUMBERS = [
  '50',
  '100',
  '200',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900'
];


@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent {
  @Input() color = 'var(--primary-color)';

  colors: { label: string; value: string }[] = COLOR_NAMES
    .reduce((currentColors, name) => {
      const colorVariations = COLOR_NUMBERS.map(number => ({
        label: `${name} ${number}`,
        value: `var(--${name}-${number})`,
      }));

      return currentColors.concat(colorVariations);
    }, [] as { label: string; value: string; }[]);

  filter = '';

  overlayVisible = false;

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

}
