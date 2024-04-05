import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaPayrollStatusesComponent } from './ta-payroll-statuses.component';

describe('TaPayrollStatusesComponent', () => {
    let component: TaPayrollStatusesComponent;
    let fixture: ComponentFixture<TaPayrollStatusesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaPayrollStatusesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaPayrollStatusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
