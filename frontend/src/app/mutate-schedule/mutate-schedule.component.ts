import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridWeek from '@fullcalendar/daygrid';
import timeGridWeek from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interaction from '@fullcalendar/interaction';
import { FullCalendarService } from '../services/full-calendar.service';
import { WorkoutTemplatesComponent } from '../workout-templates/workout-templates.component';
import { SchedulesService } from '../services/schedules.service';
import dayjs from 'dayjs';
import { EventImpl } from '@fullcalendar/core/internal';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutTemplatesService } from '../services/workout-templates.service';
import { combineLatest, firstValueFrom, map } from 'rxjs';
import { Maybe } from 'graphql/jsutils/Maybe';
import { FrontendSchedule, FrontendScheduleWorkout, FrontendService } from '../services/frontend.service';
import { AuthService } from '../services/auth.service';
import { UserSchedulesGQL, UserSchedulesQueryVariables } from '../../generated/graphql.generated';
import { cloneDeep } from '@apollo/client/utilities';

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
export class MutateScheduleComponent implements AfterViewInit, OnDestroy {

  @ViewChild(FullCalendarComponent, { static: false }) calendar?: FullCalendarComponent;

  @ViewChild(WorkoutTemplatesComponent) workoutTemplates?: WorkoutTemplatesComponent;

  mode!: 'create' | 'edit';

  title = 'New Schedule';

  existingSchedule?: FrontendSchedule;

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
    private userSchedulesGQL: UserSchedulesGQL,
    private workoutTemplatesService: WorkoutTemplatesService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private frontend: FrontendService,
    private cd: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {

    if (!this.calendar) {
      throw new Error('Calendar not found');
    }

    this.calendarApi = this.calendar.getApi();

    this.checkForExistingSchedule();
  }

  ngOnDestroy(): void {
    this.schedulesService.activeSchedule = undefined;
  }

  async checkForExistingSchedule() {

    const scheduleId$ = this.route.params.pipe(map(params => params['scheduleId']));

    const [ scheduleId, userId ] = await firstValueFrom(combineLatest([ scheduleId$, this.auth.userId ]));

    const isExistingSchedule = Boolean(scheduleId);

    this.setMode(isExistingSchedule);

    if (isExistingSchedule && userId) {

      this.fetchSchedule(userId, scheduleId);

    } else if (isExistingSchedule) {

      throw new Error('You need to be logged in to access a workout template');

    } else {

      if (this.mode === 'create') { return; }

      this.loadActiveSchedule();
    }

  }

  async fetchSchedule(userId: string, scheduleId: string) {

    const queryVariables: UserSchedulesQueryVariables = {
      userId,
      filter: { scheduleIds: [ scheduleId ] },
    }

    const { data: { user } } = await firstValueFrom(this.userSchedulesGQL.fetch(queryVariables));

    if (!user?.schedules?.length) {
      throw new Error('Failed to retrieve schedule');
    }

    const [ schedule ] = this.frontend.convertSchedules(user.schedules);

    this.schedulesService.activeSchedule = cloneDeep(schedule);

    this.setSchedule(schedule);

  }

  loadActiveSchedule() {

    const { activeSchedule } = this.schedulesService;

    if (!activeSchedule) {
      throw new Error('Active schedule not found');
    }

    this.setSchedule(activeSchedule);

  }

  setMode(isExistingSchedule: boolean) {

    if (isExistingSchedule) {
      this.mode = 'edit';
      return;
    }

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

    const scheduleToSave: FrontendSchedule = {
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
    const workouts: FrontendScheduleWorkout[] = [];

    for (const event of events) {
      if (!event.start) { continue; }

      let dow = event.start.getDay();

      const isNextWeek = dayjs(event.start).isAfter(dayjs(), 'week');

      if (isNextWeek) {
        dow = dow + 7;
      }

      const workoutTemplateKey = event.extendedProps['key'];

      const workoutTemplate = this.workoutTemplatesService.workoutTemplates.find(wt => wt.key === workoutTemplateKey);

      const newWorkout: FrontendScheduleWorkout = {
        workoutTemplateKey,
        dow,
        allDay: event.allDay,
        id: event.id.length ? event.id : undefined,
        workoutTemplateId: workoutTemplate?.id,
      }

      if (!event.allDay) {
        newWorkout.start = event.start.toTimeString().split(' ')[0];
        newWorkout.end = event.end ? event.end.toTimeString().split(' ')[0] : undefined;
      }

      workouts.push(newWorkout);
    }

    return workouts;
  }

  setSchedule(activeSchedule: FrontendSchedule) {

    if (!this.calendarApi) {
      throw new Error('Calendar API not found');
    }

    let showTimes = false;

    for (const scheduleWorkout of (activeSchedule.workouts || [])) {
      if (!scheduleWorkout) { continue; }

      const workout = this.workoutTemplatesService.workoutTemplates
        .find(t => t.key === scheduleWorkout.workoutTemplateKey);

      if (!workout) { continue; }

      const { currentRange } = this.calendarApi.getCurrentData().dateProfile;

      const eventInput = this.fullCalendar.getEventInput(workout, scheduleWorkout, currentRange.start);

      if (!eventInput.allDay) {
        showTimes = true;
      }

      this.calendarApi.addEvent(eventInput);
    }

    this.setCalendarView(activeSchedule, showTimes);

    if (!activeSchedule.name) { return; }

    this.title = activeSchedule.name;

    this.cd.detectChanges();
  }

  setEventTimes(dateString: string | undefined | null, eventInput: EventInput, time: 'start' | 'end', eventDay: dayjs.Dayjs) {
    if (!dateString) { return; }
    const [ hourString, minString, secString ] = dateString.split(':');
    eventInput[time] = eventDay.hour(Number(hourString)).minute(Number(minString)).second(Number(secString)).toDate();
  }

  setCalendarView(scheduleToEdit: FrontendSchedule, showTimes: boolean) {

    const latestWorkoutDow = this.getLatestWorkoutDow(scheduleToEdit.workouts || []);

    if (latestWorkoutDow > 6) {
      this.selectedCalendarView = 'biweekly';
    }

    this.showTimes = showTimes;

    this.updateCalendarView();
  }

  getLatestWorkoutDow(workouts: Maybe<FrontendScheduleWorkout>[]) {
    if (!workouts || !workouts.length) {
      return 0;
    }

    const dows = workouts.map(w => w?.dow || 0);

    return Math.max(...dows);
  }
}
