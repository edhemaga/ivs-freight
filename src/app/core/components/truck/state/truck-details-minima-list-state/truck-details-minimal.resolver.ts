import { TrucksMinimalListStore } from './truck-details-minimal.store';
import { TruckMinimalListResponse } from './../../../../../../../appcoretruckassist/model/truckMinimalListResponse';
import { Injectable } from '@angular/core';

import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckTService } from '../truck.service';

@Injectable({
    providedIn: 'root',
})
export class TruckMinimalResolver implements Resolve<TruckMinimalListResponse> {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private truckService: TruckTService,
        private truckMinimalListStore: TrucksMinimalListStore
    ) {}
    resolve(
        route: ActivatedRouteSnapshot
    ): Observable<TruckMinimalListResponse> | Observable<any> {
        return this.truckService
            .getTrucksMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                catchError((error) => {
                    return of('No truck data for...');
                }),
                tap((truckMinimal: TruckMinimalListResponse) => {
                    this.truckMinimalListStore.set(
                        truckMinimal.pagination.data
                    );
                })
            );
    }
}
