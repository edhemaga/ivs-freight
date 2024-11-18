import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverFlatRateReportComponent } from './driver-flat-rate-report.component';

describe('DriverFlatRateReportComponent', () => {
  let component: DriverFlatRateReportComponent;
  let fixture: ComponentFixture<DriverFlatRateReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverFlatRateReportComponent]
    });
    fixture = TestBed.createComponent(DriverFlatRateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
