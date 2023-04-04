import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedFilterComponent } from './fixed-filter.component';

describe('FixedFilterComponent', () => {
  let component: FixedFilterComponent;
  let fixture: ComponentFixture<FixedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
