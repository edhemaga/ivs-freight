import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperDetailsItemComponent } from '@pages/customer/pages/shipper-details/components/shipper-details-item/shipper-details-item.component';

describe('ShipperDetailsItemComponent', () => {
    let component: ShipperDetailsItemComponent;
    let fixture: ComponentFixture<ShipperDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ShipperDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ShipperDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
