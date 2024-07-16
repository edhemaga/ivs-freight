import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriTripInspectionComponent } from './pri-trip-inspection.component';

describe('PriTripInspectionComponent', () => {
  let component: PriTripInspectionComponent;
  let fixture: ComponentFixture<PriTripInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriTripInspectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriTripInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
