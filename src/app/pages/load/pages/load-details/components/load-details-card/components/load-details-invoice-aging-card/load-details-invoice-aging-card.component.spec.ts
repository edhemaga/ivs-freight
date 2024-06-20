import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadDetailsInvoiceAgingCardComponent } from '@pages/load/pages/load-details/components/load-details-card/components/load-details-invoice-aging-card/load-details-invoice-aging-card.component';

describe('LoadDetailsInvoiceAgingCardComponent', () => {
    let component: LoadDetailsInvoiceAgingCardComponent;
    let fixture: ComponentFixture<LoadDetailsInvoiceAgingCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadDetailsInvoiceAgingCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadDetailsInvoiceAgingCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
