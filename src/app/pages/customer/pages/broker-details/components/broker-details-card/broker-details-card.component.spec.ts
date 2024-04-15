import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsCardComponent } from '@pages/customer/pages/broker-details/components/broker-details-card/broker-details-card.component';

describe('BrokerDetailsCardComponent', () => {
    let component: BrokerDetailsCardComponent;
    let fixture: ComponentFixture<BrokerDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrokerDetailsCardComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BrokerDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
