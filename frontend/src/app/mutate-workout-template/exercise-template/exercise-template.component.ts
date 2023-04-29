import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CollapsableExerciseTemplate } from '../mutate-workout-template.component';

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

  @Input() template!: CollapsableExerciseTemplate;

  @Input() collapsed!: boolean;

  @Output() collapsedChange = new EventEmitter<boolean>();

  @Output() onAddSet = new EventEmitter<CollapsableExerciseTemplate>();

  @Output() onDeleteTemplate = new EventEmitter<number>();

  @Output() onReorderSets = new EventEmitter<CollapsableExerciseTemplate>();

  @Output() onDeleteSet = new EventEmitter<{ template: CollapsableExerciseTemplate, index: number }>();

  toggleCollapsed() {
    if (this.reorderMode) { return; }
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

}
