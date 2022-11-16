import { TrailerResponse } from '../../../../../../../appcoretruckassist/model/trailerResponse';

import { Injectable } from '@angular/core';
import {
   ActivatedRouteSnapshot,
   Resolve,
   Router,
   RouterStateSnapshot,
} from '@angular/router';
import { Observable, tap, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { TrailerTService } from '../trailer.service';

import { TrailerItemState, TrailerItemStore } from './trailer-details.store';
import { TrailersDetailsListQuery } from '../trailer-details-list-state/trailer-details-list.query';
import { TrailerDetailsListStore } from '../trailer-details-list-state/trailer-details-list.store';

@Injectable({
   providedIn: 'root',
})
export class TrailerItemResolver implements Resolve<TrailerItemState> {
   constructor(
      private trailerService: TrailerTService,
      private trailerDetailStore: TrailerItemStore,
      private trailerDetailListQuery: TrailersDetailsListQuery,
      private trailerDetailListStore: TrailerDetailsListStore,
      private router: Router
   ) {}
   resolve(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
   ): Observable<TrailerItemState> | Observable<any> {
      const trailer_id = route.paramMap.get('id');
      let trid = parseInt(trailer_id);
      if (this.trailerDetailListQuery.hasEntity(trid)) {
         return this.trailerDetailListQuery.selectEntity(trid).pipe(
            tap((trailerResponse: TrailerResponse) => {
               this.trailerDetailStore.set([trailerResponse]);
            }),
            take(1)
         );
      } else {
         return this.trailerService.getTrailerById(trid).pipe(
            catchError((error) => {
               this.router.navigate(['/trailer']);
               return of('No trailer data for...' + trailer_id);
            }),
            tap((trailerReponse: TrailerResponse) => {
               this.trailerDetailListStore.add(trailerReponse);
               this.trailerDetailStore.set([trailerReponse]);
            })
         );
      }
   }
}
