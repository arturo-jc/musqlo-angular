import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction from '@fullcalendar/interaction';
import { FullCalendarService } from '../full-calendar/full-calendar.service';
import { FixedFilterComponent } from '../shared/fixed-filter/fixed-filter.component';
import { WorkoutTemplate } from '../services/workout-templates.service';
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

  @ViewChild(FullCalendarComponent, { static: false }) calendarRef!: FullCalendarComponent;

  @ViewChild(WorkoutTemplatesComponent) workoutTemplatesRef?: WorkoutTemplatesComponent;

  title = 'New Schedule';

  calendar!: Calendar;

  selectedView: CalendarView = 'weekly';

  views: CalendarViewOption[] = [
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
    eventOrder: 'lastEdited',
    eventDidMount: (args) => {
      const { event } = args;
      if (!event.allDay) { return; }
      event.setExtendedProp('lastEdited', new Date().getTime());
    },
    eventContent: (args) => this.fullCalendar.getEventContent(args),
    eventAllow: () => {
      this.hideFixedFilter();
      return true;
    },
    drop: () => {
      this.showFixedFilter();
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

    if (this.selectedView === 'biweekly' && this.showTimes) {
      this.calendar.changeView('timeBiweekly');
      return;
    }
    if (this.selectedView === 'biweekly' && !this.showTimes) {
      this.calendar.changeView('dayBiweekly');
      return;
    }
    if (this.selectedView === 'weekly' && this.showTimes) {
      this.calendar.changeView('timeGridWeek');
      return;
    }
    this.calendar.changeView('dayGridWeek');
  }

  showFixedFilter() {
    if (!this.workoutTemplatesRef) { return; }
    this.workoutTemplatesRef.show();
  }

  hideFixedFilter() {
    if (!this.workoutTemplatesRef) { return; }
    this.workoutTemplatesRef.hide();
  }

  saveSchedule() {
    const events = this.calendar.getEvents().map(e => e.toPlainObject());
  }
}
