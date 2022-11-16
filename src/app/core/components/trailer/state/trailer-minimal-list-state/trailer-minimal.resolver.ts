import { TrailerTService } from './../trailer.service';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TrailersMinimalListStore } from './trailer-minimal.store';
import { TrailerMinimalListResponse } from 'appcoretruckassist';

@Injectable({
   providedIn: 'root',
})
export class TrailerMinimalResolver
   implements Resolve<TrailerMinimalListResponse>
{
   pageIndex: number = 1;
   pageSize: number = 25;
   count: number;
   constructor(
      private trailerService: TrailerTService,
      private trailerMinimalListStore: TrailersMinimalListStore
   ) {}
   resolve(
      route: ActivatedRouteSnapshot
   ): Observable<TrailerMinimalListResponse> | Observable<any> {
      return this.trailerService
         .getTrailersMinimalList(this.pageIndex, this.pageSize, this.count)
         .pipe(
            catchError((error) => {
               return of('No trailer data for...');
            }),
            tap((trailerMinimal: TrailerMinimalListResponse) => {
               this.trailerMinimalListStore.set(trailerMinimal.pagination.data);
            })
         );
   }
}
