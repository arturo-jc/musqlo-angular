import { Injectable } from '@angular/core';
import { EventContentArg } from '@fullcalendar/core';
import { ExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

@Injectable({
  providedIn: 'root'
})
export class FullCalendarService {

  titleStyle = {
    'font-weight': 'bold',
    'margin-bottom': '0.25rem',
  }

  bodyStyle = {
    'display': 'block',
  }

  exerciseStyle = {
    'display': 'block',
  }

  constructor() { }

  getEventContent(args: EventContentArg) {
    const { event } = args;
    const titleEl = this.createTitle(event.title);
    const bodyEl = this.createBody(event.extendedProps['exercises']);
    return { domNodes: [ titleEl, bodyEl ] };
  }

  createTitle(title: string): HTMLSpanElement {
    const titleEl = document.createElement('span');
    titleEl.classList.add('fc-event-title', 'fc-sticky');
    this.applyStyle(this.titleStyle, titleEl);
    titleEl.textContent = title;
    return titleEl;
  }

  createBody(exercises: ExerciseTemplate[]): HTMLDivElement {
    const bodyEl = document.createElement('div');
    this.applyStyle(this.bodyStyle, bodyEl);

    for (const exercise of exercises) {
      const exerciseEl = this.createExerciseEl(exercise);
      bodyEl.append(exerciseEl);
    }

    return bodyEl;
  }

  createExerciseEl(exercise: ExerciseTemplate): HTMLSpanElement {
    const exerciseEl = document.createElement('span');
    this.applyStyle(this.exerciseStyle, exerciseEl);
    exerciseEl.textContent = exercise.exerciseType;
    return exerciseEl;
  }

  applyStyle(styles: Record<string, string | null>, element: HTMLElement) {
    for (const [ style, value ] of Object.entries(styles)) {
      element.style.setProperty(style, value);
    }
  }
}
