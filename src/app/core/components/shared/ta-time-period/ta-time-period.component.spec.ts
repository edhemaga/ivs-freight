import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaTimePeriodComponent } from './ta-time-period.component';

describe('TaTimePeriodComponent', () => {
    let component: TaTimePeriodComponent;
    let fixture: ComponentFixture<TaTimePeriodComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TaTimePeriodComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TaTimePeriodComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
