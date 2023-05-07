import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FrontendExerciseTemplate } from '../../services/frontend.service';

@Component({
  selector: 'app-exercise-template',
  templateUrl: './exercise-template.component.html',
  styleUrls: ['./exercise-template.component.scss'],
  animations: [
    trigger('collapse', [
      state('hidden', style({ height: '0' })),
      state('visible', style({ height: '*' })),
      transition('visible <=> hidden', [animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')]),
      transition('void => *', animate(0)),
    ])
  ]
})
export class ExerciseTemplateComponent {
  @Input() reorderMode = false;

  @Input() hideSets = false;

  @Input() template!: FrontendExerciseTemplate;

  @Input() collapsed!: boolean;

  @Output() collapsedChange = new EventEmitter<boolean>();

  @Output() onAddSet = new EventEmitter<FrontendExerciseTemplate>();

  @Output() onDeleteTemplate = new EventEmitter<number>();

  @Output() onReorderSets = new EventEmitter<FrontendExerciseTemplate>();

  @Output() onDeleteSet = new EventEmitter<{ template: FrontendExerciseTemplate, index: number }>();

  toggleCollapsed() {
    if (this.reorderMode) { return; }
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

}
