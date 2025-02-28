import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelStopDetailsFuelExpenseCardComponent } from '@pages/fuel/pages/fuel-stop-details/components/fuel-stop-details-card/components/fuel-stop-details-fuel-expense-card/fuel-stop-details-fuel-expense-card.component';

describe('FuelStopDetailsFuelExpenseCardComponent', () => {
    let component: FuelStopDetailsFuelExpenseCardComponent;
    let fixture: ComponentFixture<FuelStopDetailsFuelExpenseCardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FuelStopDetailsFuelExpenseCardComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(
            FuelStopDetailsFuelExpenseCardComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
