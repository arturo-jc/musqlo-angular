import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import { Draggable } from '@fullcalendar/interaction';
import { WorkoutTemplate, WorkoutTemplatesService } from '../services/workout-templates.service';
import { FixedFilterComponent } from '../shared/fixed-filter/fixed-filter.component';

@Component({
  selector: 'app-workout-templates',
  templateUrl: './workout-templates.component.html',
  styleUrls: ['./workout-templates.component.scss']
})
export class WorkoutTemplatesComponent implements AfterViewInit {

  @Input() calendarRef!: FullCalendarComponent;

  @ViewChild('workoutList') workoutsRef?: ElementRef;

  @ViewChild(FixedFilterComponent) fixedFilter?: FixedFilterComponent<WorkoutTemplate>;

  calendar?: Calendar;

  constructor(
    public workoutTemplates: WorkoutTemplatesService,
  ) {
  }

  ngAfterViewInit(): void {
    this.calendar = this.calendarRef.getApi();

    if (!this.workoutsRef) { return; }

    const { nativeElement: workouts } = this.workoutsRef;

    new Draggable(workouts, {
      itemSelector: '.workout',
    })
  }

  filteredWorkoutTemplates: WorkoutTemplate[] = [];

  updateFilteredWorkoutTemplates(updatedWorkoutTemplates: WorkoutTemplate[]) {
    this.filteredWorkoutTemplates = updatedWorkoutTemplates;
  }

  show() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.show();
  }

  hide() {
    if (!this.fixedFilter) { return; }
    this.fixedFilter.hide();
  }

}
