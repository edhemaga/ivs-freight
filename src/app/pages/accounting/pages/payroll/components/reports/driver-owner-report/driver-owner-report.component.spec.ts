import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverOwnerReportComponent } from './driver-owner-report.component';

describe('DriverOwnerReportComponent', () => {
  let component: DriverOwnerReportComponent;
  let fixture: ComponentFixture<DriverOwnerReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverOwnerReportComponent]
    });
    fixture = TestBed.createComponent(DriverOwnerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
