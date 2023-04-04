import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOverlayComponent } from './add-overlay.component';

describe('AddOverlayComponent', () => {
  let component: AddOverlayComponent;
  let fixture: ComponentFixture<AddOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
