import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDateTimePickersDateCalendarsComponent } from './ta-custom-datetime-pickers-date-calendars.component';

describe('TaCustomDateTimePickersDateCalendarsComponent', () => {
    let component: TaCustomDateTimePickersDateCalendarsComponent;
    let fixture: ComponentFixture<TaCustomDateTimePickersDateCalendarsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDateTimePickersDateCalendarsComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaCustomDateTimePickersDateCalendarsComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
