import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerDetailsComponent } from '@pages/customer/pages/broker-details/broker-details.component';

describe('BrokerDetailsComponent', () => {
    let component: BrokerDetailsComponent;
    let fixture: ComponentFixture<BrokerDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrokerDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BrokerDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
