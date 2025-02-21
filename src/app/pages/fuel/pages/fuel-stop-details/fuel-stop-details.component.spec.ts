import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsComponent } from '@pages/fuel/pages/fuel-stop-details/fuel-stop-details.component';

describe('FuelStopDetailsComponent', () => {
    let component: FuelStopDetailsComponent;
    let fixture: ComponentFixture<FuelStopDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FuelStopDetailsComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FuelStopDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
