import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomPeriodRangeComponent } from '@shared/components/ta-custom-period-range/ta-custom-period-range.component';

describe('TaCustomPeriodRangeComponent', () => {
    let component: TaCustomPeriodRangeComponent;
    let fixture: ComponentFixture<TaCustomPeriodRangeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaCustomPeriodRangeComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TaCustomPeriodRangeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
