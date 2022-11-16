import { CalendarQuery } from './calendar.query';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CalendarStoreService } from './calendar.service';

//import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarResolverService implements Resolve<any> {
  constructor(
    private calendarStoreService: CalendarStoreService,
    private calendarQuery: CalendarQuery
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return of(true);
  }
}
