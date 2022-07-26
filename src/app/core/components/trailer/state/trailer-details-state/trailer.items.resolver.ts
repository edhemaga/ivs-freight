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
import { TrailerDetailsQuery } from './trailer-details.query';

@Injectable({
  providedIn: 'root',
})
export class TrailerItemResolver implements Resolve<TrailerItemState> {
  constructor(
    private trailerService: TrailerTService,
    private trailerDetailStore: TrailerItemStore,
    private trailerDetailQuery: TrailerDetailsQuery,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TrailerItemState> | Observable<any> {
    const trailer_id = route.paramMap.get('id');
    let id = parseInt(trailer_id);
    //  if(this.trailerDetailQuery.hasEntity(id)){
    //   return this.trailerDetailQuery.selectEntity(id).pipe(
    //     catchError((error)=>{
    //       return of('erorr')
    //     }),
    //     take(1)
    //   )
    //  }
    //  else{
    return this.trailerService.getTrailerById(id).pipe(
      catchError((error) => {
        this.router.navigate(['/trailer']);
        return of('No trailer data for...' + trailer_id);
      }),
      tap((trailerReponse: TrailerResponse) => {
        this.trailerDetailStore.set({ ids: trailerReponse });
      })
    );
  }

  // }
}
