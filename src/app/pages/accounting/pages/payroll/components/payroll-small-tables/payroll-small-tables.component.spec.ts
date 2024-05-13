import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollSmallTablesComponent } from '@pages/accounting/pages/payroll/components/payroll-small-tables/payroll-small-tables.component';

describe('PayrollSmallTablesComponent', () => {
    let component: PayrollSmallTablesComponent;
    let fixture: ComponentFixture<PayrollSmallTablesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PayrollSmallTablesComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PayrollSmallTablesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
