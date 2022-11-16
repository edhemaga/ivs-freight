import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoadTService } from '../../load.service';
import { LoadMinimalListStore } from './load-details-minimal.store';
import { LoadMinimalListResponse } from '../../../../../../../../appcoretruckassist/model/loadMinimalListResponse';

@Injectable({
   providedIn: 'root',
})
export class LoadMinimalListResolver
   implements Resolve<LoadMinimalListResponse>
{
   pageIndex: number = 1;
   pageSize: number = 25;
   constructor(
      private loadService: LoadTService,
      private loadMinimalListStore: LoadMinimalListStore
   ) {}
   resolve(
      route: ActivatedRouteSnapshot
   ): Observable<LoadMinimalListResponse> | Observable<any> {
      return this.loadService
         .getLoadMinimalList(this.pageIndex, this.pageSize)
         .pipe(
            catchError((error) => {
               return of('No load data for...');
            }),
            tap((loadListData: LoadMinimalListResponse) => {
               this.loadMinimalListStore.set(loadListData.pagination.data);
            })
         );
   }
}
