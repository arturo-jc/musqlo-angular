import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import { Draggable } from '@fullcalendar/interaction';
import { WorkoutTemplatesService } from '../services/workout-templates.service';

@Component({
  selector: 'app-workout-templates',
  templateUrl: './workout-templates.component.html',
  styleUrls: ['./workout-templates.component.scss']
})
export class WorkoutTemplatesComponent implements AfterViewInit {

  @Input() calendarRef!: FullCalendarComponent;

  @ViewChild('workoutList') workoutsRef!: ElementRef;

  calendar?: Calendar;

  constructor(
    public workoutTemplates: WorkoutTemplatesService,
  ) {
  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();

    const { nativeElement: workouts } = this.workoutsRef;

    new Draggable(workouts, {
      itemSelector: '.workout',
    })
  }

}
