import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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

export const COLOR_SATURATION_LEVELS = [
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
  styleUrls: ['./color-picker.component.scss'],
  providers: [TitleCasePipe],
})
export class ColorPickerComponent implements OnInit {
  @Input() color = 'var(--primary-color)';

  colors!: { label: string; value: string}[];

  constructor(private titleCasePipe: TitleCasePipe) {}

  filter = '';

  overlayVisible = false;

  ngOnInit(): void {
    this.setColors();
  }

  setColors() {
    const colors: { label: string; value: string}[] = [];

    for (const name of COLOR_NAMES) {
      for (const level of COLOR_SATURATION_LEVELS) {

        const newColor = {
          label: `${this.titleCasePipe.transform(name)} ${level}`,
          value: `var(--${name}-${level})`,
        };

        colors.push(newColor);
      }
    }

    this.colors = colors;
  }

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

}
