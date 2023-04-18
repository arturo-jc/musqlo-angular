import { Injectable } from '@angular/core';
import { EventContentArg, EventInput } from '@fullcalendar/core';
import { EventImpl } from '@fullcalendar/core/internal';
import dayjs from 'dayjs';
import { DEFAULT_BG_COLOR } from '../mutate-workout-template/mutate-workout-template.component';
import { WorkoutTemplatesService } from '../workout-templates/workout-templates.service';
import { LIGHT_DARK_THRESHOLD } from '../shared/color-picker/color-picker.component';
import { OptionalId } from '../shared/utils';
import { WorkoutTemplate, ExerciseTemplate } from '../../generated/graphql.generated';

@Injectable({
  providedIn: 'root'
})
export class FullCalendarService {

  ellipsis = {
    'overflow': 'hidden',
    'white-space': 'nowrap',
    'text-overflow': 'ellipsis',
  }

  titleStyle = {
    'display': 'inline-block',
    'max-width': '100%',
    'font-weight': 'bold',
    'margin-bottom': '0.25rem',
    ...this.ellipsis,
  }

  bodyStyle = {
    'display': 'block',
  }

  exerciseStyle = {
    'display': 'flex',
  }

  exerciseTypeStyle = {
    'flex': '1',
    ...this.ellipsis,
  }

  constructor(private workoutTemplates: WorkoutTemplatesService) { }

  getEventContent(args: EventContentArg) {
    const { event } = args;
    const containerEl = this.createContainer(event);
    const titleEl = this.createTitle(event.title);
    const bodyEl = this.createBody(event.extendedProps['key']);
    containerEl.append(titleEl, bodyEl);
    return { domNodes: [ containerEl ] };
  }

  createContainer(event: EventImpl): HTMLDivElement {
    const containerEl = document.createElement('div');
    containerEl.style.setProperty('color', event.textColor);
    return containerEl;
  }

  createTitle(title: string): HTMLSpanElement {
    const titleEl = document.createElement('span');
    titleEl.textContent = title;
    this.applyStyle(this.titleStyle, titleEl);
    return titleEl;
  }

  createBody(workoutTemplateKey: string): HTMLDivElement {

    const bodyEl = document.createElement('div');
    this.applyStyle(this.bodyStyle, bodyEl);

    const workoutTemplate = this.workoutTemplates.workoutTemplates.find(t => t.key === workoutTemplateKey);

    for (const exercise of workoutTemplate?.exercises || []) {
      const exerciseEl = this.createExerciseEl(exercise);
      bodyEl.append(exerciseEl);
    }

    return bodyEl;
  }

  createExerciseEl(exercise: OptionalId<ExerciseTemplate>): HTMLDivElement {
    const exerciseEl = document.createElement('div');
    this.applyStyle(this.exerciseStyle, exerciseEl);

    const exerciseTypeEl = document.createElement('div');
    exerciseTypeEl.textContent = exercise.exerciseType;
    this.applyStyle(this.exerciseTypeStyle, exerciseTypeEl);
    exerciseEl.append(exerciseTypeEl);

    const setCountEl = document.createElement('div');
    setCountEl.textContent = `x ${exercise.sets.length}`;
    exerciseEl.append(setCountEl);

    return exerciseEl;
  }

  applyStyle(styles: Record<string, string | null>, element: HTMLElement) {
    for (const [ style, value ] of Object.entries(styles)) {
      element.style.setProperty(style, value);
    }
  }

  getEventInput(workoutTemplate: OptionalId<WorkoutTemplate>): EventInput {

    const backgroundColor = workoutTemplate?.backgroundColor || DEFAULT_BG_COLOR;

    return {
      title: workoutTemplate.name,
      extendedProps: {
        key: workoutTemplate.key,
      },
      backgroundColor,
      borderColor: backgroundColor,
      textColor: this.getTextColor(backgroundColor),
    }
  }

  getTextColor(backgroundColor: string): string {

    const lightTextColor = 'var(--gray-50)';
    const darkTextColor = 'var(--gray-800)';

    const consecutiveNumbersRegex = new RegExp(/[.*!\d](\d+)[.*!\d]/g);

    const regexMatches = backgroundColor.match(consecutiveNumbersRegex);

    const bgColorIntensity = regexMatches?.length ? Number(regexMatches[0]) : undefined;

    const isBgColorDark = (bgColorIntensity && bgColorIntensity > LIGHT_DARK_THRESHOLD) || backgroundColor.includes('--primary-color');

    const textColor = isBgColorDark ? lightTextColor : darkTextColor;

    return textColor;
  }

  findFirstSunday(start: dayjs.Dayjs): dayjs.Dayjs {
    if (start.day() === 0) {
      return start;
    }
    return this.findFirstSunday(start.add(1, 'day'));
  }

}
