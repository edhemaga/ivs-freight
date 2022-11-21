import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { DriverListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverTService } from '../driver.service';
import { DriversActiveState, DriversActiveStore } from './driver-active.store';

@Injectable({
    providedIn: 'root',
})
export class DriverActiveResolver implements Resolve<DriversActiveState> {
    constructor(
        private driverService: DriverTService,
        private store: DriversActiveStore
    ) {}

    resolve(): Observable<DriversActiveState | boolean> {
        return this.driverService
            .getDrivers(1, undefined, undefined, undefined, 1, 25)
            .pipe(
                catchError(() => {
                    return of('No drivers data...');
                }),
                tap((driverPagination: DriverListResponse) => {
                    localStorage.setItem(
                        'driverTableCount',
                        JSON.stringify({
                            active: driverPagination.activeCount,
                            inactive: driverPagination.inactiveCount,
                        })
                    );

                    this.store.set(driverPagination.pagination.data);
                })
            );
    }
}
