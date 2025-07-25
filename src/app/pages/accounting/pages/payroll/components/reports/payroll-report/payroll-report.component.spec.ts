import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollReportComponent } from '@pages/accounting/pages/payroll/components/payroll-report/payroll-report.component';

describe('PayrollReportComponent', () => {
    let component: PayrollReportComponent;
    let fixture: ComponentFixture<PayrollReportComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PayrollReportComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PayrollReportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
