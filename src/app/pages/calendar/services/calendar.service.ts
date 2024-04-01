import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Services
import { SharedService } from 'src/app/core/services/shared/shared.service';

// Store
import { CalendarStore } from '../state/calendar.store';

@Injectable({ providedIn: 'root' })
export class CalendarStoreService {
    constructor(
        private calendarStore: CalendarStore,
        private http: HttpClient,
        private sharedService: SharedService
    ) {}
}
