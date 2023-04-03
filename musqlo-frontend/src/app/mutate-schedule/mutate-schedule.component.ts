import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction from '@fullcalendar/interaction';
import { FullCalendarService } from '../full-calendar/full-calendar.service';
import { WorkoutTemplatesComponent } from '../workout-templates/workout-templates.component';

export type CalendarView = 'weekly' | 'biweekly';

export interface CalendarViewOption {
  label: string;
  value: CalendarView;
}

@Component({
  selector: 'app-mutate-schedule',
  templateUrl: './mutate-schedule.component.html',
  styleUrls: ['./mutate-schedule.component.scss']
})
export class MutateScheduleComponent implements AfterViewInit {

  @ViewChild(FullCalendarComponent, { static: false }) calendar?: FullCalendarComponent;

  @ViewChild(WorkoutTemplatesComponent) workoutTemplates?: WorkoutTemplatesComponent;

  title = 'New Schedule';

  calendarApi?: Calendar;

  selectedCalendarView: CalendarView = 'weekly';

  calendarViews: CalendarViewOption[] = [
    {
      label: 'Weekly',
      value: 'weekly',
    },
    {
      label: 'Biweekly',
      value: 'biweekly',
    }
 ];

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
    eventOrder: 'lastModified',
    eventDidMount: (args) => {
      const { event } = args;
      if (!event.allDay) { return; }
      event.setExtendedProp('lastModified', new Date().getTime());
    },
    eventContent: (args) => this.fullCalendar.getEventContent(args),
    eventAllow: () => {
      this.hideWorkoutTemplates();
      return true;
    },
    drop: () => {
      this.showWorkoutTemplates();
    }
  }

  constructor(
    public fullCalendar: FullCalendarService,
  ) {}

  ngAfterViewInit(): void {
    if (!this.calendar) { return; }
    this.calendarApi = this.calendar.getApi();
  }

  updateCalendarView() {
    if (!this.calendarApi) { return; }

    if (this.selectedCalendarView === 'biweekly' && this.showTimes) {
      this.calendarApi.changeView('timeBiweekly');
      return;
    }
    if (this.selectedCalendarView === 'biweekly' && !this.showTimes) {
      this.calendarApi.changeView('dayBiweekly');
      return;
    }
    if (this.selectedCalendarView === 'weekly' && this.showTimes) {
      this.calendarApi.changeView('timeGridWeek');
      return;
    }
    this.calendarApi.changeView('dayGridWeek');
  }

  showWorkoutTemplates() {
    if (!this.workoutTemplates) { return; }
    this.workoutTemplates.show();
  }

  hideWorkoutTemplates() {
    if (!this.workoutTemplates) { return; }
    this.workoutTemplates.hide();
  }

  saveSchedule() {
    if (!this.calendarApi) { return; }
    const events = this.calendarApi.getEvents().map(e => e.toPlainObject());
    console.log(events);
  }
}
