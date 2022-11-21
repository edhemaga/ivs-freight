import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { PMTruckUnitListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PmTService } from '../pm.service';
import { PmTruckState, PmTruckStore } from './pm-truck.store';

@Injectable({
  providedIn: 'root',
})
export class pmTruckResolver implements Resolve<PmTruckState> {
  constructor(
    private pmService: PmTService,
    private pmTruckStore: PmTruckStore
  ) {}
  resolve(): Observable<PmTruckState | boolean> {
    return this.pmService
      .getPMTrailerUnitList(undefined, undefined, 1, 25)
      .pipe(
        catchError(() => {
          return of('No pm trucks data...');
        }),
        tap((pmTruckPagination: PMTruckUnitListResponse) => {
          /*  localStorage.setItem(
          'pmTruckTableCount',
          JSON.stringify({
            pmTruck: pmTruckPagination.pagination.count,
          })
        );
        
        this.pmTruckStore.set(pmTruckPagination.pagination.data); */
        })
      );
  }
}
