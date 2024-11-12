import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsBankCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-bank-card/repair-shop-details-bank-card.component';

describe('RepairShopDetailsBankCardComponent', () => {
    let component: RepairShopDetailsBankCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsBankCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsBankCardComponent],
        });
        fixture = TestBed.createComponent(RepairShopDetailsBankCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
