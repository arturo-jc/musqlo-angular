import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutateScheduleComponent } from './mutate-schedule.component';

describe('MutateScheduleComponent', () => {
  let component: MutateScheduleComponent;
  let fixture: ComponentFixture<MutateScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutateScheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MutateScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
