import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckQuery } from './truck.query';
import { TruckService } from './truck.service';
import { TruckState, TruckStore } from './truck.store';


@Injectable({
  providedIn: 'root',
})
export class DriverResolver implements Resolve<TruckState> {
  constructor(
    private truckService: TruckService,
    private truckStore: TruckStore,
    private truckQuery: TruckQuery
  ) {}
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<TruckState> | Observable<any> {
    console.log('RESOLVER TRUCK');
    return this.truckService.getTrucks().pipe(
      catchError((error) => {
        return of('No truck data...');
      }),
      tap((entities) => this.truckStore.set({ entities: entities }))
    );

  }
}
