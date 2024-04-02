import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

// Services
import { CalendarService } from '../services/calendar.service';

// Store
import { CalendarQuery } from '../state/calendar.query';

@Injectable({
    providedIn: 'root',
})
export class CalendarResolver implements Resolve<any> {
    constructor(
        private calendarService: CalendarService,
        private calendarQuery: CalendarQuery
    ) {}
    resolve(): Observable<any> {
        return of(true);
    }
}
