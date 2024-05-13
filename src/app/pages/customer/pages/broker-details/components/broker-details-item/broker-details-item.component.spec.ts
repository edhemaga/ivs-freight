import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsItemComponent } from '@pages/customer/pages/broker-details/components/broker-details-item/broker-details-item.component';

describe('BrokerDetailsItemComponent', () => {
    let component: BrokerDetailsItemComponent;
    let fixture: ComponentFixture<BrokerDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrokerDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BrokerDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
