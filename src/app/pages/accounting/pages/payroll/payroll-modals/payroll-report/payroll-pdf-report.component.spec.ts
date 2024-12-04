import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollPdfReportComponent } from './payroll-pdf-report.component';

describe('PayrollPdfReportComponent', () => {
  let component: PayrollPdfReportComponent;
  let fixture: ComponentFixture<PayrollPdfReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PayrollPdfReportComponent]
    });
    fixture = TestBed.createComponent(PayrollPdfReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
