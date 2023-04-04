import { TitleCasePipe } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Listbox } from 'primeng/listbox';

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
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900'
];

export const LIGHT_DARK_THRESHOLD = 200;

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  providers: [TitleCasePipe],
})
export class ColorPickerComponent implements OnInit {

  @Input() color = 'var(--primary-color)';

  @Output() colorChange = new EventEmitter<string>();

  @ViewChild(Listbox) listbox?: Listbox;

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

  forwardSelection() {
    this.overlayVisible = false;
    this.colorChange.emit(this.color);
  }

  toggleOverlay() {
    this.overlayVisible = !this.overlayVisible;
  }

  focus() {
    if (!this.listbox) { return; }
    const input = this.listbox.el.nativeElement.querySelector('.p-listbox-filter') as HTMLInputElement;
    if (!input) { return; }
    setTimeout(() => input.focus(), 0);
  }

}
