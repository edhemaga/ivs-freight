import { DriverMinimalListResponse } from './../../../../../../../appcoretruckassist/model/driverMinimalListResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversMinimalListStore } from './driver-minimal-list.store';

@Injectable({
  providedIn: 'root',
})
export class DriverMinimalResolver
  implements Resolve<DriverMinimalListResponse>
{
  pageIndex: number = 1;
  pageSize: number = 25;
  count: number;
  constructor(
    private driverService: DriverTService,
    private driverMinimalList: DriversMinimalListStore
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<DriverMinimalListResponse> | Observable<any> {
    return this.driverService
      .getDriversMinimalList(this.pageIndex, this.pageSize, this.count)
      .pipe(
        catchError((error) => {
          return of('No drivers data for...');
        }),
        tap((driverMinimalList: DriverMinimalListResponse) => {
          /* this.driverMinimalList.set(driverMinimalList.pagination.data); */
        })
      );
  }
}
