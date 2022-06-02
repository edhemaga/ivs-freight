import { TrailerResponse } from './../../../../../../appcoretruckassist/model/trailerResponse';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { TrailerTService } from './trailer.service';
import { TrailerState, TrailerStore } from './trailer.store';




@Injectable({
  providedIn: 'root',
})
export class TrailerItemResolver implements Resolve<TrailerState> {
  constructor(
    private trailerService: TrailerTService,
    private trailerStore: TrailerStore,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TrailerState> | Observable<any> {
     const trailer_id=route.paramMap.get('id')    
    return this.trailerService.getTrailerById(+trailer_id).pipe(
        catchError((error)=>{
            return of('No trailer data for...' + trailer_id);
        }),
        take(1)
    );
  }
}