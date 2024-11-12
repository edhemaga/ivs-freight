import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairShopDetailsMapCoverCardComponent } from '@pages/repair/pages/repair-shop-details/components/repair-shop-details-card/components/repair-shop-details-map-cover-card/repair-shop-details-map-cover-card.component';

describe('RepairShopDetailsMapCoverCardComponent', () => {
    let component: RepairShopDetailsMapCoverCardComponent;
    let fixture: ComponentFixture<RepairShopDetailsMapCoverCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RepairShopDetailsMapCoverCardComponent],
        });
        fixture = TestBed.createComponent(
            RepairShopDetailsMapCoverCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
