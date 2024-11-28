import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemRepairComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repair/repair-shop-details-item-repair.component';

describe('RepairShopDetailsItemRepairComponent', () => {
    let component: RepairShopDetailsItemRepairComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemRepairComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsItemRepairComponent],
        });
        fixture = TestBed.createComponent(RepairShopDetailsItemRepairComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
