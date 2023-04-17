import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction from '@fullcalendar/interaction';
import { FullCalendarService } from '../full-calendar/full-calendar.service';
import { WorkoutTemplatesComponent } from '../workout-templates/workout-templates.component';
import { Schedule, SchedulesService, ScheduleWorkout } from '../services/schedules.service';
import dayjs from 'dayjs';
import { EventImpl } from '@fullcalendar/core/internal';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutTemplatesService } from '../workout-templates/workout-templates.service';

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
export class MutateScheduleComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(FullCalendarComponent, { static: false }) calendar?: FullCalendarComponent;

  @ViewChild(WorkoutTemplatesComponent) workoutTemplates?: WorkoutTemplatesComponent;

  mode!: 'create' | 'edit';

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
    aspectRatio: 2.5,
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
    private schedulesService: SchedulesService,
    private workoutTemplatesService: WorkoutTemplatesService,
    private router: Router,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.setMode();
  }

  ngAfterViewInit(): void {
    if (!this.calendar) { return; }
    this.calendarApi = this.calendar.getApi();

    if (this.mode === 'edit') {
      this.loadSchedule();
    }
  }

  ngOnDestroy(): void {
  }

  setMode() {
    const [ urlFragment ] = this.route.snapshot.url;
    this.mode = urlFragment.path === 'new' ? 'create' : 'edit';
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

    const scheduleToSave: Schedule = {
      name: this.title,
      workouts: this.getScheduleWorkouts(this.calendarApi.getEvents()),
    }

    if (this.mode === 'create') {
      this.schedulesService.addSchedule(scheduleToSave);
    } else if (this.mode === 'edit') {
      this.schedulesService.updateSchedule(scheduleToSave);
    }

    this.router.navigate([ 'dashboard' ]);
  }

  getScheduleWorkouts(events: EventImpl[]) {
    const workouts: ScheduleWorkout[] = [];

    for (const event of events) {
      if (!event.start) { continue; }

      let dow = event.start.getDay();

      const isNextWeek = dayjs(event.start).isAfter(dayjs(), 'week');

      if (isNextWeek) {
        dow = dow + 7;
      }

      const newWorkout: ScheduleWorkout = {
        workoutTemplateKey: event.extendedProps['key'],
        dow,
        allDay: event.allDay,
      }

      if (!event.allDay) {
        newWorkout.start = event.start.toTimeString().split(' ')[0];
        newWorkout.end = event.end ? event.end.toTimeString().split(' ')[0] : undefined;
      }

      workouts.push(newWorkout);
    }

    return workouts;
  }

  loadSchedule() {
    const { scheduleToEdit } = this.schedulesService;

    if (!scheduleToEdit || !this.calendarApi) { return; }

    const { currentRange } = this.calendarApi.getCurrentData().dateProfile;

    const scheduleStart = this.fullCalendar.findFirstSunday(dayjs(currentRange.start));

    let showTimes = false;

    for (const scheduleWorkout of scheduleToEdit.workouts) {
      const workout = this.workoutTemplatesService.workoutTemplates
        .find(t => t.key === scheduleWorkout.workoutTemplateKey);

      if (!workout) { continue; }

      const eventInput = this.fullCalendar.getEventInput(workout);

      eventInput.allDay = scheduleWorkout.allDay;

      const eventDay = scheduleStart.add(scheduleWorkout.dow, 'day');

      if (eventInput.allDay) {
        eventInput.start = eventDay.toDate();
      } else {
        this.setEventTimes(scheduleWorkout.start, eventInput, 'start', eventDay);
        this.setEventTimes(scheduleWorkout.end, eventInput, 'end', eventDay);
        showTimes = true;
      }

      this.calendarApi.addEvent(eventInput);
    }

    this.setCalendarView(scheduleToEdit, showTimes);

    this.title = scheduleToEdit.name;

    this.cd.detectChanges();
  }

  setEventTimes(dateString: string | undefined, eventInput: EventInput, time: 'start' | 'end', eventDay: dayjs.Dayjs) {
    if (!dateString) { return; }
    const [ hourString, minString, secString ] = dateString.split(':');
    eventInput[time] = eventDay.hour(Number(hourString)).minute(Number(minString)).second(Number(secString)).toDate();
  }

  setCalendarView(scheduleToEdit: Schedule, showTimes: boolean) {

    const latestWorkoutDow = Math.max(...scheduleToEdit.workouts.map(w => w.dow));

    if (latestWorkoutDow > 6) {
      this.selectedCalendarView = 'biweekly';
    }

    this.showTimes = showTimes;

    this.updateCalendarView();
  }
}
