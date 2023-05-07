import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Calendar } from '@fullcalendar/core';
import { Draggable } from '@fullcalendar/interaction';
import { WorkoutTemplatesService } from '../services/workout-templates.service';
import { FixedFilterComponent } from '../shared/fixed-filter/fixed-filter.component';
import { FrontendWorkoutTemplate } from '../services/frontend.service';

@Component({
  selector: 'app-workout-templates',
  templateUrl: './workout-templates.component.html',
  styleUrls: ['./workout-templates.component.scss']
})
export class WorkoutTemplatesComponent implements AfterViewInit {

  @Input() calendar!: FullCalendarComponent;

  @ViewChild('workoutsRef') workouts?: ElementRef;

  @ViewChild(FixedFilterComponent) fixedFilter?: FixedFilterComponent<FrontendWorkoutTemplate>;

  calendarApi?: Calendar;

  filteredWorkoutTemplates: FrontendWorkoutTemplate[] = [];

  draggableSelector = 'fc-workout';

  constructor(
    public workoutTemplates: WorkoutTemplatesService,
  ) {
  }

  ngAfterViewInit(): void {
    this.calendarApi = this.calendar.getApi();

    if (!this.workouts) { return; }

    const { nativeElement: workouts } = this.workouts;

    new Draggable(workouts, {
      itemSelector: `.${this.draggableSelector}`,
    })
  }

  setFilteredWorkoutTemplates(updatedWorkoutTemplates: FrontendWorkoutTemplate[]) {
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
