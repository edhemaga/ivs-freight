import { ParkingListResponse } from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CompanyParkingService } from '../services/company-parking.service';
import {
    ParkingState,
    ParkingStore,
} from '../state/parking-state/company-parking.store';

@Injectable({
    providedIn: 'root',
})
export class CompanyParkingResolver implements Resolve<ParkingState> {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private parkingService: CompanyParkingService,
        private parkingStore: ParkingStore
    ) {}
    resolve(): Observable<ParkingState | boolean> {
        return this.parkingService
            .getParkingList(this.pageIndex, this.pageSize, this.count)
            .pipe(
                catchError(() => {
                    return of('No Parking data...');
                }),
                tap((parkingPagination: ParkingListResponse) => {
                    this.parkingStore.set(parkingPagination.pagination.data);
                })
            );
    }
}
