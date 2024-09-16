import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchTablePickupDeliveryComponent } from '@pages/dispatch/pages/dispatch/components/dispatch-table/components/dispatch-table-pickup-delivery/dispatch-table-pickup-delivery.component';

describe('DispatchTablePickupDeliveryComponent', () => {
    let component: DispatchTablePickupDeliveryComponent;
    let fixture: ComponentFixture<DispatchTablePickupDeliveryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DispatchTablePickupDeliveryComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DispatchTablePickupDeliveryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
