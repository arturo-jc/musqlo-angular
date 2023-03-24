import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseItemsComponent } from './exercise-items.component';

describe('ExerciseItemsComponent', () => {
  let component: ExerciseItemsComponent;
  let fixture: ComponentFixture<ExerciseItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
