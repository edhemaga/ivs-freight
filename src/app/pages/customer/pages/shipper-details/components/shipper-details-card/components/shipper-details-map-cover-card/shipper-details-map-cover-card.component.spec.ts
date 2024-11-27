import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperDetailsMapCoverCardComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-card/components/shipper-details-map-cover-card/shipper-details-map-cover-card.component';

describe('ShipperDetailsMapCoverCardComponent', () => {
    let component: ShipperDetailsMapCoverCardComponent;
    let fixture: ComponentFixture<ShipperDetailsMapCoverCardComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ShipperDetailsMapCoverCardComponent],
        });
        fixture = TestBed.createComponent(ShipperDetailsMapCoverCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
