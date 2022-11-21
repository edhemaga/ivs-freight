/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverMedicalModalComponent } from './driver-medical-modal.component';

describe('DriverMedicalModalComponent', () => {
  let component: DriverMedicalModalComponent;
  let fixture: ComponentFixture<DriverMedicalModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DriverMedicalModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverMedicalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
