import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';
import { WorkoutTemplate } from '../mutate-workout-template/mutate-workout-template.component';
import dayGridWeek from '@fullcalendar/daygrid';
import { InputSwitchOnChangeEvent } from 'primeng/inputswitch';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-mutate-schedule',
  templateUrl: './mutate-schedule.component.html',
  styleUrls: ['./mutate-schedule.component.scss']
})
export class MutateScheduleComponent implements AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarRef!: FullCalendarComponent;

  calendar!: Calendar;

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

  calendarOptions: CalendarOptions = {
    headerToolbar: false,
    initialView: 'dayGridWeek',
    plugins: [ dayGridWeek ],
    dayHeaderFormat: { weekday: 'long' },
    views: {
      biWeekly: {
        type: 'dayGridWeek',
        duration: { weeks: 2 },
        dayCellContent: args => args.dayNumberText = '',
      }
    },


  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();
  }

  changeCalendarView(event: InputSwitchOnChangeEvent) {
    const newView = event.checked ? 'biWeekly' : 'dayGridWeek';
    this.calendar.changeView(newView);
  }

}
