import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsTitleCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-title-card/fuel-stop-details-title-card.component';

describe('FuelStopDetailsTitleCardComponent', () => {
    let component: FuelStopDetailsTitleCardComponent;
    let fixture: ComponentFixture<FuelStopDetailsTitleCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsTitleCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FuelStopDetailsTitleCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
