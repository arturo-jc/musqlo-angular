import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction, { Draggable } from '@fullcalendar/interaction';
import { ExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';
import { FullCalendarService } from '../full-calendar/full-calendar.service';
import { FixedOverlayComponent } from '../shared/fixed-overlay/fixed-overlay.component';

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
  backgroundColor: string;
}

@Component({
  selector: 'app-mutate-schedule',
  templateUrl: './mutate-schedule.component.html',
  styleUrls: ['./mutate-schedule.component.scss']
})
export class MutateScheduleComponent implements AfterViewInit {

  @ViewChild('calendar', { static: false }) calendarRef!: FullCalendarComponent;

  @ViewChild('fixedOverlay') fixedOverlay?: FixedOverlayComponent;

  calendar!: Calendar;

  biweekly = false;

  showTimes = false;

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
    eventDidMount: (args) => {
      const { event } = args;
      if (!event.allDay) { return; }
      event.setExtendedProp('lastEdited', new Date().getTime());
    },
    eventContent: (args) => this.fullCalendar.getEventContent(args),
    eventAllow: () => {
      this.hideFixedOverlay();
      return true;
    },
    drop: () => {
      this.showFixedOverlay();
    }
  }

  constructor(
    public fullCalendar: FullCalendarService,
  ) {}

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();
  }

  updateCalendarView() {
    if (!this.calendar) { return; }

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

  showFixedOverlay() {
    if (!this.fixedOverlay || this.fixedOverlay.overlayVisible) { return; }
    this.fixedOverlay.show();
  }

  hideFixedOverlay() {
    if (!this.fixedOverlay?.overlayVisible) { return; }
    this.fixedOverlay.hide();
  }

  saveSchedule() {
    const events = this.calendar.getEvents().map(e => e.toPlainObject());
  }
}
