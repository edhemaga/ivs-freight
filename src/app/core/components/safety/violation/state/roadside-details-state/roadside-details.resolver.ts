import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { RoadsideService } from '../roadside.service';
import { RoadItemState, RoadItemStore } from './roadside-details.store';
import { RoadsideInspectionResponse } from '../../../../../../../../appcoretruckassist/model/roadsideInspectionResponse';

@Injectable({
  providedIn: 'root',
})
export class RoadItemResolver implements Resolve<RoadItemState> {
  constructor(
    private roadService: RoadsideService,
    private roadDetailsStore: RoadItemStore,

    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<RoadItemState> | Observable<any> {
    const truck_id = route.paramMap.get('id');
    let id = parseInt(truck_id);
    // if (this.truckDetailsListQuery.hasEntity(trid)) {
    //   return this.truckDetailsListQuery.selectEntity(trid).pipe(
    //     tap((truckResponse: TruckResponse) => {
    //       this.truckDetailsStore.set([truckResponse]);
    //     }),
    //     take(1)
    //   );
    // } else {
    return this.roadService.getRoadSideById(id).pipe(
      catchError((error) => {
        this.router.navigate(['/truck']);
        return of('No road data for...' + id);
      }),
      tap((roadResponse: RoadsideInspectionResponse) => {
        this.roadDetailsStore.set([roadResponse]);
      })
    );
  }
}
