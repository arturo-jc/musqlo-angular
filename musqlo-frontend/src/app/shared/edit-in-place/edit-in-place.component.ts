import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Inplace } from 'primeng/inplace';

@Component({
  selector: 'app-edit-in-place',
  templateUrl: './edit-in-place.component.html',
  styleUrls: ['./edit-in-place.component.scss']
})
export class EditInPlaceComponent implements AfterViewInit {
  @Input() text!: string;

  @Input() placeholder!: string;

  @Output() textChange = new EventEmitter<string>();

  @Output() onActivate = new EventEmitter();

  @ViewChild(Inplace) inplace?: Inplace;

  @ViewChildren('inputRef') inputQueryList!: QueryList<ElementRef>;

  @HostListener('document:click', ['$event'])
  deactivate() {
    if (!this.inplace || !this.inplace.active) { return; }
    this.inplace.deactivate();
  }

  ngAfterViewInit(): void {
    this.autoFocusOnActivate();
  }

  autoFocusOnActivate() {
    this.inputQueryList.changes.subscribe(() => {
      if (!this.inputQueryList.first) { return; }
      this.inputQueryList.first.nativeElement.focus();
    })
  }
}
