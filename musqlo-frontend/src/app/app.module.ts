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


@NgModule({
  declarations: [
    AppComponent,
    MutateWorkoutTemplateComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
