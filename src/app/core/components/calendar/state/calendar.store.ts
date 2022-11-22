import { ICalendar } from './calendar.model';

import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface CalendarState extends EntityState<ICalendar, string> {}

export function createInitialState(): CalendarState {
    return {
        statistic: {
            todayObject: null,
            mtdObject: [],
            ytdObject: [],
            allTimeObject: [],
        },
    };
}

@Injectable({
    providedIn: 'root',
})
@StoreConfig({ name: 'calendar' })
export class CalendarStore extends EntityStore<CalendarState> {
    constructor() {
        super(createInitialState());
    }
}
