import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDateTimePickerCalendarDatesMainComponent } from './ta-custom-datetime-pickers-calendar-dates-main.component';

describe('TaCustomDateTimePickerCalendarDatesMainComponent', () => {
    let component: TaCustomDateTimePickerCalendarDatesMainComponent;
    let fixture: ComponentFixture<TaCustomDateTimePickerCalendarDatesMainComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDateTimePickerCalendarDatesMainComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaCustomDateTimePickerCalendarDatesMainComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
