import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsLastFuelPriceCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-last-fuel-price-card/fuel-stop-details-last-fuel-price-card.component';

describe('FuelStopDetailsLastFuelPriceCardComponent', () => {
    let component: FuelStopDetailsLastFuelPriceCardComponent;
    let fixture: ComponentFixture<FuelStopDetailsLastFuelPriceCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsLastFuelPriceCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FuelStopDetailsLastFuelPriceCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
