import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemDropdownComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-dropdown/repair-shop-details-item-dropdown.component';

describe('RepairShopDetailsItemDropdownComponent', () => {
    let component: RepairShopDetailsItemDropdownComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemDropdownComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsItemDropdownComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsItemDropdownComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
