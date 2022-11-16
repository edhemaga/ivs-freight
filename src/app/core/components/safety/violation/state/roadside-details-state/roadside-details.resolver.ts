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
import { RoadsideDetailsListStore } from './roadside-details-list-state/roadside-details-list.store';
import { RoadsideDetailsListQuery } from './roadside-details-list-state/roadside-details-list.query';

@Injectable({
   providedIn: 'root',
})
export class RoadItemResolver implements Resolve<RoadItemState> {
   constructor(
      private roadService: RoadsideService,
      private roadDetailsStore: RoadItemStore,
      private rsdls: RoadsideDetailsListStore,
      private rsdlq: RoadsideDetailsListQuery,
      private router: Router
   ) {}
   resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<RoadItemState> | Observable<any> {
      const rs_id = route.paramMap.get('id');
      let id = parseInt(rs_id);
      // if (this.rsdlq.hasEntity(id)) {
      //   return this.rsdlq.selectEntity(id).pipe(
      //     tap((roadResponse: RoadsideInspectionResponse) => {
      //       this.roadDetailsStore.set([roadResponse]);
      //     }),
      //     take(1)
      //   );
      // } else {
      return this.roadService.getRoadsideById(id).pipe(
         catchError((error) => {
            this.router.navigate(['/safety/violation']);
            return of('No road data for...' + id);
         }),
         tap((roadResponse: RoadsideInspectionResponse) => {
            this.rsdls.add(roadResponse);
            this.roadDetailsStore.set([roadResponse]);
         })
      );
   }
   // }
}
