import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsPaymentCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-payment-card/load-details-payment-card.component';

describe('LoadDetailsPaymentCardComponent', () => {
    let component: LoadDetailsPaymentCardComponent;
    let fixture: ComponentFixture<LoadDetailsPaymentCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsPaymentCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsPaymentCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
