import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap,take } from 'rxjs/operators';
import { TruckTService } from '../truck.service';

import { TruckState, TruckStore } from '../truck.store';

@Injectable({
  providedIn: 'root',
})
export class TruckItemResolver implements Resolve<TruckState> {
  constructor(
    private truckService: TruckTService,
    private truckStore: TruckStore,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TruckState> | Observable<any> {
     const truck_id=route.paramMap.get('id') 
    
     return this.truckService.getTruckById(+truck_id).pipe(
        catchError((error)=>{
            return of('No truck data for...' + truck_id);
        }),
        take(1)
    ); 
  }
}