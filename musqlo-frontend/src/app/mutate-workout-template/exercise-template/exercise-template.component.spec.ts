import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseTemplateComponent } from './exercise-template.component';

describe('ExerciseTemplateComponent', () => {
  let component: ExerciseTemplateComponent;
  let fixture: ComponentFixture<ExerciseTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExerciseTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
