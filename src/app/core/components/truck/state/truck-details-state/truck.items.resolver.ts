import { TruckResponse } from './../../../../../../../appcoretruckassist/model/truckResponse';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { TruckTService } from '../truck.service';
import { TruckDetailsQuery } from './truck.details.query';
import { TruckItemState, TruckItemStore } from './truck.details.store';
import { TrucksDetailsListQuery } from '../truck-details-list-state/truck-details-list.query';
import { TrucksDetailsListStore } from '../truck-details-list-state/truck-details-list.store';

@Injectable({
  providedIn: 'root',
})
export class TruckItemResolver implements Resolve<TruckItemState> {
  constructor(
    private truckService: TruckTService,
    private truckDetailsStore: TruckItemStore,
    private truckDetailsListQuery: TrucksDetailsListQuery,
    private truckDetailsListStore: TrucksDetailsListStore,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TruckItemState> | Observable<any> {
    const truck_id = route.paramMap.get('id');
    let trid = parseInt(truck_id);
    if (this.truckDetailsListQuery.hasEntity(trid)) {
      return this.truckDetailsListQuery.selectEntity(trid).pipe(
        tap((truckResponse: TruckResponse) => {
          this.truckDetailsStore.set([truckResponse]);
        }),
        take(1)
      );
    } else {
      return this.truckService.getTruckById(trid).pipe(
        catchError((error) => {
          this.router.navigate(['/truck']);
          return of('No truck data for...' + trid);
        }),
        tap((truckResponse: TruckResponse) => {
          this.truckDetailsListStore.add(truckResponse);
          this.truckDetailsStore.set([truckResponse]);
        })
      );
    }
  }
}
