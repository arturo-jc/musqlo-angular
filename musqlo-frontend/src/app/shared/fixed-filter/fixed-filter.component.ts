import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FixedOverlayComponent } from '../fixed-overlay/fixed-overlay.component';
import { FixedFilterOptionDirective } from './fixed-filter-option.directive';
import { FixedFilterOptionsDirective } from './fixed-filter-options.directive';

@Component({
  selector: 'app-fixed-filter',
  templateUrl: './fixed-filter.component.html',
  styleUrls: ['./fixed-filter.component.scss']
})
export class FixedFilterComponent<T extends { [key: string]: any }> implements AfterContentInit, OnInit {

  @Input() placeholder!: string;

  @Input() options!: T[];

  @Input() optionLabel!: string;

  @Output() onFilter = new EventEmitter<T[]>();

  @ViewChild(InputText) inputTextRef?: InputText;

  @ViewChild(FixedOverlayComponent) fixedOverlayRef?: FixedOverlayComponent;

  @ContentChild(FixedFilterOptionsDirective) customOptionsTemplate?: FixedFilterOptionsDirective;

  @ContentChild(FixedFilterOptionDirective) customOptionTemplate?: FixedFilterOptionDirective;

  ngOnInit(): void {
    this.filterOptions();
  }

  ngAfterContentInit(): void {
  }

  filter = '';

  filteredOptions!: T[];

  filterOptions() {
    this.filteredOptions = this.options.filter(opt => {
      return (opt[this.optionLabel]).toLowerCase().includes(this.filter.trim().toLowerCase())
    })
    this.onFilter.emit(this.filteredOptions);
  }

  setFocus() {
    if (!this.inputTextRef) { return; }
    setTimeout(() => this.inputTextRef?.el.nativeElement.focus(), 0);
  }

  hide() {
    if (!this.fixedOverlayRef) { return; }
    this.fixedOverlayRef.hide();
  }
}
