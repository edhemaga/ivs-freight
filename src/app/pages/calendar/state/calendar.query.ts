import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import {
    CalendarState,
    CalendarStore,
} from '@pages/calendar/state/calendar.store';

@Injectable({
    providedIn: 'root',
})
export class CalendarQuery extends QueryEntity<CalendarState> {
    constructor(protected store: CalendarStore) {
        super(store);
    }
}
