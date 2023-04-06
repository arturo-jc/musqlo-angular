import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { OverlayModule } from 'primeng/overlay';
import { ListboxModule } from 'primeng/listbox';
import { MenubarModule } from 'primeng/menubar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InplaceModule } from 'primeng/inplace'
import { ColorPickerModule } from 'primeng/colorpicker'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MutateWorkoutTemplateComponent } from './mutate-workout-template/mutate-workout-template.component';
import { MutateScheduleComponent } from './mutate-schedule/mutate-schedule.component';
import { WorkoutTemplateEventDataPipe } from './full-calendar/workout-template-event-data.pipe';
import { ExerciseTemplatePlaceholderPipe } from './shared/exercise-template-placeholder.pipe';
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
import { LogInComponent } from './log-in/log-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ValidationErrorMessagePipe } from './shared/validation-error-message.pipe';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';

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
    LogInComponent,
    SignUpComponent,
    ValidationErrorMessagePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    ColorPickerModule,
    FullCalendarModule,
    GraphQLModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
