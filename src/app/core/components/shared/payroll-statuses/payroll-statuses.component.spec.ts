import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollStatusesComponent } from './payroll-statuses.component';

describe('PayrollStatusesComponent', () => {
    let component: PayrollStatusesComponent;
    let fixture: ComponentFixture<PayrollStatusesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PayrollStatusesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PayrollStatusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
