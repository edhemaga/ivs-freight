import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckTService } from './truck.service';
import { TruckState, TruckStore } from './truck.store';

@Injectable({
  providedIn: 'root',
})
export class TruckResolver implements Resolve<TruckState> {
  tableTab: number = 1;
  pageIndex: number = 1;
  pageSize: number = 25;

  constructor(
    private truckService: TruckTService,
    private truckStore: TruckStore
  ) {}
  resolve(): Observable<TruckState | boolean> {
    if (this.truckStore.getValue().ids?.length) {
      return of(true);
    } else {
      return this.truckService
        .getTruckList(this.tableTab, this.pageIndex, this.pageSize)
        .pipe(
          catchError(() => {
            return of('No truck data...');
          }),
          tap((truckPagination: TruckListResponse) => {
            this.truckStore.set(truckPagination.pagination.data);
          })
        );
    }
  }
}
