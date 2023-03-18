import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutateWorkoutTemplateComponent } from './mutate-workout-template.component';

describe('MutateWorkoutTemplateComponent', () => {
  let component: MutateWorkoutTemplateComponent;
  let fixture: ComponentFixture<MutateWorkoutTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutateWorkoutTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutateWorkoutTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
