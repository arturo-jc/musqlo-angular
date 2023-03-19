import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, EventContentArg } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction, { Draggable } from '@fullcalendar/interaction';
import { ExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
}

@Component({
  selector: 'app-mutate-schedule',
  templateUrl: './mutate-schedule.component.html',
  styleUrls: ['./mutate-schedule.component.scss']
})
export class MutateScheduleComponent implements AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarRef!: FullCalendarComponent;
  @ViewChild('workoutList') workoutsRef!: ElementRef;

  calendar!: Calendar;

  biweekly = false;
  showTimes = false;

  workouts: WorkoutTemplate[] = [
    {
      name: 'My Favorite Workout',
      exercises: [
        {
          exerciseType: 'Deadlift',
          sets: [
            {
              order: 1,
              reps: 20,
              weight: 20,
            },
            {
              order: 2,
              reps: 14,
              weight: 29,
            },
            {
              order: 3,
              reps: 24,
              weight: 27,
            }
          ],
          order: 1
        },
        {
          exerciseType: 'Dumbbells',
          sets: [
            {
              order: 1,
              reps: 25,
              weight: 89,
            },
          ],
          order: 2,
        }
      ]
    },
    {
      name: 'My Least Favorite Workout',
      exercises: [
        {
          exerciseType: 'Runnning',
          sets: [],
          order: 1
        }
      ]
    }
  ]

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

  calendarOptions: CalendarOptions = {
    headerToolbar: false,
    editable: true,
    initialView: 'dayGridWeek',
    plugins: [ dayGridWeek, timeGridWeek, interaction ],
    dayHeaderFormat: { weekday: 'long' },
    views: {
      dayBiweekly: {
        type: 'dayGridWeek',
        duration: { weeks: 2 },
        dayHeaderFormat: { weekday: 'long' },
      },
      timeBiweekly: {
        type: 'timeGridWeek',
        duration: { weeks: 2 },
        dayHeaderFormat: { weekday: 'short' },
      }
    },
    eventOrder: 'lastEdited',
    eventDidMount({ event }) {
      if (!event.allDay) { return; }
      event.setExtendedProp('lastEdited', new Date().getTime());
    },
    eventContent: (args) => this.getEventContent(args),
  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();

    const { nativeElement: workouts } = this.workoutsRef;

    new Draggable(workouts, {
      itemSelector: '.workout',
    })

  }

  updateCalendarView() {
    if (this.biweekly && this.showTimes) {
      this.calendar.changeView('timeBiweekly');
      return;
    }
    if (this.biweekly && !this.showTimes) {
      this.calendar.changeView('dayBiweekly');
      return;
    }
    if (!this.biweekly && this.showTimes) {
      this.calendar.changeView('timeGridWeek');
      return;
    }
    this.calendar.changeView('dayGridWeek');
  }

  saveSchedule() {
    const events = this.calendar.getEvents().map(e => e.toPlainObject());
  }

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
