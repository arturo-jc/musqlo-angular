import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInPlaceComponent } from './edit-in-place.component';

describe('EditInPlaceComponent', () => {
  let component: EditInPlaceComponent;
  let fixture: ComponentFixture<EditInPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInPlaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
