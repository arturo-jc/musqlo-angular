import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Inplace } from 'primeng/inplace';

@Component({
  selector: 'app-edit-in-place',
  templateUrl: './edit-in-place.component.html',
  styleUrls: ['./edit-in-place.component.scss']
})
export class EditInPlaceComponent implements OnInit, AfterViewInit {
  @Input() text!: string;

  @Input() placeholder!: string;

  @Output() textChange = new EventEmitter<string>();

  @Output() onActivate = new EventEmitter();

  @ViewChild(Inplace) inplace?: Inplace;

  @ViewChild('required') inputModel!: NgModel;

  @ViewChildren('inputRef') inputQueryList!: QueryList<ElementRef>;

  @HostListener('document:click', ['$event'])
  deactivate() {
    if (!this.inplace || !this.inplace.active) { return; }
    if (!this.editedText.trim().length) {
      console.log('notify');
      return;
    };
    this.inplace.deactivate();
  }

  editedText!: string;

  valid = true;

  ngOnInit(): void {
    this.reset()
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

  reset() {
    this.editedText = this.text;
  }

  forwardActivate() {
    this.onActivate.emit();
    this.reset();
  }

  updateText() {
    this.setValid();
    if (!this.editedText.trim().length) { return; }
    this.text = this.editedText;
    this.textChange.emit(this.text);
  }

  setValid() {
    if (!this.inputModel) { return; }
    this.valid = (this.inputModel.control.status === 'VALID');
  }
}
