import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsItemRepairedVehicleComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-item/components/repair-shop-details-item-repaired-vehicle/repair-shop-details-item-repaired-vehicle.component';

describe('RepairShopDetailsItemRepairedVehicleComponent', () => {
    let component: RepairShopDetailsItemRepairedVehicleComponent;
    let fixture: ComponentFixture<RepairShopDetailsItemRepairedVehicleComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsItemRepairedVehicleComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsItemRepairedVehicleComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
