import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckTService } from './truck.service';
import { TruckState, TruckStore } from './truck.store';


@Injectable({
  providedIn: 'root',
})
export class TruckResolver implements Resolve<TruckState> {
  constructor(
    private truckService: TruckTService,
    private truckStore: TruckStore,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<TruckState | boolean> {
    
    return this.truckService.getTruckList(1, 1, 25).pipe(
      catchError((error) => {
        return of('No truck data...');
      }),
      tap((truckPagination: TruckListResponse) => {
        this.truckStore.set(truckPagination.pagination.data);
      })
    );
    /* if (this.truckStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.truckService.getTruckList(1, 1, 25).pipe(
        catchError((error) => {
          return of('No truck data...');
        }),
        tap((truckPagination: TruckListResponse) => {
          this.truckStore.set(truckPagination.pagination.data);
        })
      );
    } */

  }
}
