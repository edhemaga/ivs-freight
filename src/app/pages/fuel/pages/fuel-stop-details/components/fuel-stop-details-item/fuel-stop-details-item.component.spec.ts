import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsItemComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-item/fuel-stop-details-item.component';

describe('FuelStopDetailsItemComponent', () => {
    let component: FuelStopDetailsItemComponent;
    let fixture: ComponentFixture<FuelStopDetailsItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FuelStopDetailsItemComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FuelStopDetailsItemComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
