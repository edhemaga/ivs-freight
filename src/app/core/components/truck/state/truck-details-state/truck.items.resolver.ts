import { TruckResponse } from './../../../../../../../appcoretruckassist/model/truckResponse';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap,take } from 'rxjs/operators';
import { TruckTService } from '../truck.service';

import { TruckState} from '../truck.store';
import { TruckDetailsQuery } from './truck.details.query';
import { TruckItemStore } from './truck.details.store';

@Injectable({
  providedIn: 'root',
})
export class TruckItemResolver implements Resolve<TruckState> {
  constructor(
    private truckService: TruckTService,
    private truckDetailsStore:TruckItemStore,
    private truckQuery: TruckDetailsQuery,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TruckState> | Observable<any> {
     const truck_id=route.paramMap.get('id') 
     let id=parseInt(truck_id)
     if(this.truckQuery.hasEntity(id)){
      return this.truckQuery.selectEntity(id).pipe(
        catchError((error)=>{
          return of('error')
        }),
        take(1)
      )
     }else{
      return this.truckService.getTruckById(id).pipe(
        catchError((error)=>{
            return of('No truck data for...' + id);
        }),
        tap((truckResponse:TruckResponse)=>{
          this.truckDetailsStore.add(truckResponse)
        })
    ); 
     }
   
  }
}