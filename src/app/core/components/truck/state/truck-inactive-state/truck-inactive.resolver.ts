import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { TruckListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TruckTService } from '../truck.service';
import { TruckInactiveState, TruckInactiveStore } from './truck-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class TruckInactiveResolver implements Resolve<TruckInactiveState> {
    constructor(
        private truckService: TruckTService,
        private truckStore: TruckInactiveStore
    ) {}
    resolve(): Observable<TruckInactiveState | boolean> {
        return this.truckService.getTruckList(0, 1, 25).pipe(
            catchError(() => {
                return of('No active trucks...');
            }),
            tap((truckPagination: TruckListResponse) => {
                localStorage.setItem(
                    'truckTableCount',
                    JSON.stringify({
                        active: truckPagination.activeCount,
                        inactive: truckPagination.inactiveCount,
                    })
                );

                this.truckStore.set(truckPagination.pagination.data);
            })
        );
    }
}
