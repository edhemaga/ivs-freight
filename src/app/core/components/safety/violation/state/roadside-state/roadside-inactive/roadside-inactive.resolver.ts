import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { RoadsideInspectionListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RoadsideService } from '../../roadside.service';
import {
   RoadsideInactiveState,
   RoadsideInactiveStore,
} from './roadside-inactive.store';

@Injectable({
   providedIn: 'root',
})
export class RoadsideInactiveResolver
   implements Resolve<RoadsideInactiveState>
{
   constructor(
      private roadsideService: RoadsideService,
      private roadsideStore: RoadsideInactiveStore
   ) {}
   resolve(): Observable<RoadsideInactiveState | boolean> {
      return this.roadsideService.getRoadsideList(false, 1, 1, 25).pipe(
         catchError(() => {
            return of('No roadside inactive data...');
         }),
         tap((roadsidePagination: RoadsideInspectionListResponse) => {
            console.log('inactive: ', roadsidePagination);
            localStorage.setItem(
               'roadsideTableCount',
               JSON.stringify({
                  active: roadsidePagination.active,
                  inactive: roadsidePagination.inactive,
               })
            );

            this.roadsideStore.set(roadsidePagination.pagination.data);
         })
      );
   }
}
