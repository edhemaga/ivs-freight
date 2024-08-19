import { Injectable } from '@angular/core';


import { Observable, of, catchError, tap } from 'rxjs';

// services
import { TruckService } from '@shared/services/truck.service';

// store
import { TrucksMinimalListStore } from '@pages/truck/state/truck-details-minima-list-state/truck-details-minimal.store';

// models
import { TruckMinimalListResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class TruckMinimalResolver  {
    pageIndex: number = 1;
    pageSize: number = 25;
    count: number;
    constructor(
        private truckService: TruckService,
        private truckMinimalListStore: TrucksMinimalListStore
    ) {}
    resolve(): Observable<TruckMinimalListResponse> | Observable<any> {
        return this.truckService
            .getTrucksMinimalList(this.pageIndex, this.pageSize)
            .pipe(
                catchError(() => {
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
