import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Inplace } from 'primeng/inplace';

@Component({
  selector: 'app-edit-in-place',
  templateUrl: './edit-in-place.component.html',
  styleUrls: ['./edit-in-place.component.scss']
})
export class EditInPlaceComponent implements AfterViewInit {
  @Input() text!: string;

  @Output() textChange = new EventEmitter<string>();

  @ViewChild(Inplace) inplaceRef?: Inplace;

  @ViewChildren('input') inputQueryList!: QueryList<ElementRef>;

  @HostListener('document:click', ['$event'])
  deactivateTitleInplace() {
    if (!this.inplaceRef) { return; }
    if (!this.inplaceRef.active) { return; }
    this.inplaceRef.deactivate();
  }

  ngAfterViewInit(): void {
    this.inputQueryList.changes.subscribe(() => {
      if (!this.inputQueryList.first) { return; }
      this.inputQueryList.first.nativeElement.focus();
    })
  }
}
