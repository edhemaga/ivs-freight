import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckTService } from '../truck.service';
import { TruckActiveState, TruckActiveStore } from './truck-active.store';

@Injectable({
    providedIn: 'root',
})
export class TruckActiveResolver implements Resolve<TruckActiveState> {
    constructor(
        private truckService: TruckTService,
        private truckStore: TruckActiveStore
    ) {}
    resolve(): Observable<TruckActiveState | boolean> {
        return this.truckService.getTruckList(1, 1, 25).pipe(
            catchError(() => {
                return of('No inactive trucks...');
            }),
            tap((truckPagination: TruckListResponse) => {
                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckPagination.activeCount,
                        inactive: truckPagination.inactiveCount,
                    })
                );

                this.truckStore.set(truckPagination.pagination?.data);
            })
        );
    }
}
