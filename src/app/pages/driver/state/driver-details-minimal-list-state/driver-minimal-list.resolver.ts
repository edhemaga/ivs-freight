import { Injectable } from '@angular/core';

import { Resolve } from '@angular/router';
import { DriverMinimalListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DriverService } from '../../services/driver.service';
import {
    DriverMinimalListState,
    DriversMinimalListStore,
} from './driver-minimal-list.store';

@Injectable({
    providedIn: 'root',
})
export class DriverMinimalResolver implements Resolve<DriverMinimalListState> {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private driverService: DriverService,
        private driverMinimalListStore: DriversMinimalListStore
    ) {}
    resolve(): Observable<DriverMinimalListResponse> | Observable<any> {
        return this.driverService
            .getDriversMinimalList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No drivers data for...');
                }),
                tap((driverMinimalList: DriverMinimalListResponse) => {
                    this.driverMinimalListStore.set(
                        driverMinimalList.pagination.data
                    );
                })
            );
    }
}
