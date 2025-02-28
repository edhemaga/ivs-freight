import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsItemTransactionComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/components/fuel-stop-details-item-transaction/fuel-stop-details-item-transaction.component';

describe('FuelStopDetailsItemTransactionComponent', () => {
    let component: FuelStopDetailsItemTransactionComponent;
    let fixture: ComponentFixture<FuelStopDetailsItemTransactionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsItemTransactionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FuelStopDetailsItemTransactionComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
