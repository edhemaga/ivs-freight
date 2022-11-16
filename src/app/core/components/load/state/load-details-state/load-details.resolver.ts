import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap, take } from 'rxjs/operators';
import { LoadResponse } from '../../../../../../../appcoretruckassist/model/loadResponse';
import { LoadTService } from '../load.service';
import { LoadDetailsListQuery } from './load-details-list-state/load-d-list.query';
import { LoadDetailsListStore } from './load-details-list-state/load-d-list.store';
import { LoadItemStore } from './load-details.store';

@Injectable({
   providedIn: 'root',
})
export class LoatItemResolver implements Resolve<LoadResponse[]> {
   constructor(
      private loadService: LoadTService,
      private loadItemStore: LoadItemStore,
      private router: Router,
      private ldlStore: LoadDetailsListStore,
      private ldlQuery: LoadDetailsListQuery
   ) {}
   resolve(
      route: ActivatedRouteSnapshot
   ): Observable<LoadResponse[]> | Observable<any> {
      const load_id = route.paramMap.get('id');
      let id = parseInt(load_id);
      if (this.ldlQuery.hasEntity(id)) {
         return this.ldlQuery.selectEntity(id).pipe(
            tap((loadResponse: LoadResponse) => {
               this.loadItemStore.set([loadResponse]);
            }),
            take(1)
         );
      } else {
         return this.loadService.getLoadById(id).pipe(
            catchError((error) => {
               this.router.navigate(['/load']);
               return of('No Load data for...' + id);
            }),
            tap((loadResponse: LoadResponse) => {
               this.ldlStore.add(loadResponse);
               this.loadItemStore.set([loadResponse]);
            })
         );
      }
   }
}
