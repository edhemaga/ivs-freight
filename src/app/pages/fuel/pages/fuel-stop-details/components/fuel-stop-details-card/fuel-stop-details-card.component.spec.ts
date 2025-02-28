import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/fuel-stop-details-card.component';

describe('FuelStopDetailsCardComponent', () => {
    let component: FuelStopDetailsCardComponent;
    let fixture: ComponentFixture<FuelStopDetailsCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FuelStopDetailsCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
