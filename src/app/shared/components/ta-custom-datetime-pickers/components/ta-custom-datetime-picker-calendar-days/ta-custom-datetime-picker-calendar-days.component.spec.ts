import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDateTimePickerCalendarDaysComponent } from './ta-custom-datetime-picker-calendar-days.component';

describe('TaCustomDateTimePickerCalendarDaysComponent', () => {
    let component: TaCustomDateTimePickerCalendarDaysComponent;
    let fixture: ComponentFixture<TaCustomDateTimePickerCalendarDaysComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDateTimePickerCalendarDaysComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaCustomDateTimePickerCalendarDaysComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
