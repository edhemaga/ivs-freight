import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarMonthComponent } from '@pages/calendar/pages/calendar/components/calendar-month/calendar-month.component';

describe('CalendarMonthComponent', () => {
    let component: CalendarMonthComponent;
    let fixture: ComponentFixture<CalendarMonthComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CalendarMonthComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarMonthComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
