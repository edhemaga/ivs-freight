import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsMapCoverCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-map-cover-card/fuel-stop-details-map-cover-card.component';

describe('FuelStopDetailsMapCoverCardComponent', () => {
    let component: FuelStopDetailsMapCoverCardComponent;
    let fixture: ComponentFixture<FuelStopDetailsMapCoverCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsMapCoverCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FuelStopDetailsMapCoverCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
