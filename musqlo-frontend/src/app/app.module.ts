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
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { OverlayModule } from 'primeng/overlay';
import { ListboxModule } from 'primeng/listbox';
import { MenubarModule } from 'primeng/menubar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InplaceModule } from 'primeng/inplace'
import { WorkoutTemplateEventDataPipe } from './full-calendar/workout-template-event-data.pipe';
import { ExerciseTemplatePlaceholderPipe } from './exercise-template-placeholder.pipe';
import { FixedOverlayComponent } from './shared/fixed-overlay/fixed-overlay.component';
import { ExerciseTemplateComponent } from './mutate-workout-template/exercise-template/exercise-template.component';
import { ExerciseItemsComponent } from './mutate-workout-template/exercise-items/exercise-items.component';
import { WorkoutTemplatesComponent } from './workout-templates/workout-templates.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EditInPlaceComponent } from './shared/edit-in-place/edit-in-place.component';
import { FixedFilterComponent } from './shared/fixed-filter/fixed-filter.component';
import { FixedFilterOptionsDirective } from './shared/fixed-filter/fixed-filter-options.directive';
import { FixedFilterOptionDirective } from './shared/fixed-filter/fixed-filter-option.directive';
import { ColorPickerComponent } from './shared/color-picker/color-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    MutateWorkoutTemplateComponent,
    MutateScheduleComponent,
    WorkoutTemplateEventDataPipe,
    ExerciseTemplatePlaceholderPipe,
    FixedOverlayComponent,
    ExerciseTemplateComponent,
    ExerciseItemsComponent,
    WorkoutTemplatesComponent,
    SidebarComponent,
    DashboardComponent,
    EditInPlaceComponent,
    FixedFilterComponent,
    FixedFilterOptionsDirective,
    FixedFilterOptionDirective,
    ColorPickerComponent,
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
    InputTextModule,
    ToggleButtonModule,
    InputSwitchModule,
    RippleModule,
    OverlayModule,
    ListboxModule,
    MenubarModule,
    SelectButtonModule,
    InplaceModule,
    FullCalendarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
