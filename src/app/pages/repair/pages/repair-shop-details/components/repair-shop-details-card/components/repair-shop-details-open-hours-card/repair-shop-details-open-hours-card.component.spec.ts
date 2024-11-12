import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsOpenHoursCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-open-hours-card/repair-shop-details-open-hours-card.component';

describe('RepairShopDetailsOpenHoursCardComponent', () => {
    let component: RepairShopDetailsOpenHoursCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsOpenHoursCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsOpenHoursCardComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsOpenHoursCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
