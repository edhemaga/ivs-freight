import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

// Services
import { CalendarStoreService } from '../services/calendar.service';

// Store
import { CalendarQuery } from '../state/calendar.query';

//import { ProductService } from '../product/product.service';

@Injectable({
    providedIn: 'root',
})
export class CalendarResolver implements Resolve<any> {
    constructor(
        private calendarStoreService: CalendarStoreService,
        private calendarQuery: CalendarQuery
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return of(true);
    }
}
