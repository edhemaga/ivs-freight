import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsServicesCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-services-card/repair-shop-details-services-card.component';

describe('RepairShopDetailsServicesCardComponent', () => {
    let component: RepairShopDetailsServicesCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsServicesCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsServicesCardComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsServicesCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
