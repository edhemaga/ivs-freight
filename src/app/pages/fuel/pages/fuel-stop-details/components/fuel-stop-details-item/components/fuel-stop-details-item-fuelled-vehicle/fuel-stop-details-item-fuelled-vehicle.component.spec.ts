import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsItemFuelledVehicleComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/components/fuel-stop-details-item-fuelled-vehicle/fuel-stop-details-item-fuelled-vehicle.component';

describe('FuelStopDetailsItemFuelledVehicleComponent', () => {
    let component: FuelStopDetailsItemFuelledVehicleComponent;
    let fixture: ComponentFixture<FuelStopDetailsItemFuelledVehicleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsItemFuelledVehicleComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FuelStopDetailsItemFuelledVehicleComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
