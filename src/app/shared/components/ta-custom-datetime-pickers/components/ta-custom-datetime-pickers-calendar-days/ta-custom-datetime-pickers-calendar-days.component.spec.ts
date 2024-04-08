import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaCustomDateTimePickersCalendarDaysComponent } from './ta-custom-datetime-pickers-calendar-days.component';

describe('TaCustomDateTimePickersCalendarDaysComponent', () => {
    let component: TaCustomDateTimePickersCalendarDaysComponent;
    let fixture: ComponentFixture<TaCustomDateTimePickersCalendarDaysComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TaCustomDateTimePickersCalendarDaysComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(
            TaCustomDateTimePickersCalendarDaysComponent
        );
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
