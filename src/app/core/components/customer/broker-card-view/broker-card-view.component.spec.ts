import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCardViewComponent } from './broker-card-view.component';

describe('BrokerCardViewComponent', () => {
    let component: BrokerCardViewComponent;
    let fixture: ComponentFixture<BrokerCardViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BrokerCardViewComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BrokerCardViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
