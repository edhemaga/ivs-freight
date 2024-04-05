import { TestBed } from '@angular/core/testing';

import { CalendarDateTimePicker } from './calendar-datetime-picker.service';

describe('CalendarScrollService', () => {
    let service: CalendarDateTimePicker;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CalendarDateTimePicker);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
