import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MenubarModule } from 'primeng/menubar';
import { WorkoutTemplateEventDataPipe } from './full-calendar/workout-template-event-data.pipe';
import { ExerciseTemplatePlaceholderPipe } from './exercise-template-placeholder.pipe';
import { FixedOverlayComponent } from './shared/fixed-overlay/fixed-overlay.component';
import { ExerciseTemplateComponent } from './mutate-workout-template/exercise-template/exercise-template.component';

@NgModule({
  declarations: [
    AppComponent,
    MutateWorkoutTemplateComponent,
    MutateScheduleComponent,
    WorkoutTemplateEventDataPipe,
    ExerciseTemplatePlaceholderPipe,
    FixedOverlayComponent,
    ExerciseTemplateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    ButtonModule,
    TableModule,
    InputNumberModule,
    ToggleButtonModule,
    InputSwitchModule,
    RippleModule,
    OverlayPanelModule,
    MenubarModule,
    FullCalendarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
