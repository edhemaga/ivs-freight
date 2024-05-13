import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperDetailsCardComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-card/shipper-details-card.component';

describe('ShipperDetailsCardComponent', () => {
    let component: ShipperDetailsCardComponent;
    let fixture: ComponentFixture<ShipperDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShipperDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShipperDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
