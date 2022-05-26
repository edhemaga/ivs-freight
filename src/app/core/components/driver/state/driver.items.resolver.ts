import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { DriverListResponse, DriverResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriversQuery } from './driver.query';
import { DriverTService } from './driver.service';
import { DriversState, DriversStore } from './driver.store';

@Injectable({
  providedIn: 'root',
})
export class DriverItemResolver implements Resolve<DriversState> {
  constructor(
    private driverService: DriverTService,
    private driverStore: DriversStore,
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<DriversState> | Observable<any> {
     const driver_id=route.paramMap.get('id')    
    return this.driverService.getDriverById(+driver_id).pipe(
        catchError((error)=>{
            this.driverStore.set({ entities: [] });
            return of('No drivers data for...' + driver_id);
        }),
        tap((driverRespon: DriverResponse) => {
            this.driverStore.set({ entities: driverRespon[driver_id] })
          })
    );
  }
}