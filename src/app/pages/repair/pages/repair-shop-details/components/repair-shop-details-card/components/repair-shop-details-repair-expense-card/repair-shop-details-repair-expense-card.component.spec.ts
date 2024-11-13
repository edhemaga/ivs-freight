import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsRepairExpenseCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-repair-expense-card/repair-shop-details-repair-expense-card.component';

describe('RepairShopDetailsRepairExpenseCardComponent', () => {
    let component: RepairShopDetailsRepairExpenseCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsRepairExpenseCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsRepairExpenseCardComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsRepairExpenseCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
