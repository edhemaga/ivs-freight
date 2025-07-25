/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipperModalComponent } from '@pages/customer/pages/shipper-modal/shipper-modal.component';

describe('ShipperModalComponent', () => {
    let component: ShipperModalComponent;
    let fixture: ComponentFixture<ShipperModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShipperModalComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShipperModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
