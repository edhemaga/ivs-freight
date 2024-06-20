import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsBillingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-billing-card/load-details-billing-card.component';

describe('LoadDetailsBillingCardComponent', () => {
    let component: LoadDetailsBillingCardComponent;
    let fixture: ComponentFixture<LoadDetailsBillingCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsBillingCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsBillingCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
