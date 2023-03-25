import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import { Draggable } from '@fullcalendar/interaction';
import { ExerciseTemplate } from '../mutate-workout-template/mutate-workout-template.component';

export interface WorkoutTemplate {
  name: string;
  exercises: ExerciseTemplate[];
  backgroundColor: string;
}

@Component({
  selector: 'app-workout-templates',
  templateUrl: './workout-templates.component.html',
  styleUrls: ['./workout-templates.component.scss']
})
export class WorkoutTemplatesComponent implements AfterViewInit {

  @Input() calendarRef!: FullCalendarComponent;

  @ViewChild('workoutList') workoutsRef!: ElementRef;

  calendar?: Calendar;

  workouts: WorkoutTemplate[] = [
    {
      name: 'My Favorite Workout',
      backgroundColor: 'var(--primary-color)',
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
          exerciseType: 'Dumbbells and other words that make this into a very long title',
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
      backgroundColor: 'var(--pink-500)',
      exercises: [
        {
          exerciseType: 'Runnning',
          sets: [
            {
              order: 1,
              reps: 23,
              weight: 49,
            },
          ],
          order: 1
        }
      ]
    }
  ]

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();

    const { nativeElement: workouts } = this.workoutsRef;

    new Draggable(workouts, {
      itemSelector: '.workout',
    })
  }

}
