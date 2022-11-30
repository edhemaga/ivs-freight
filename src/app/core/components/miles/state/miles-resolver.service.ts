import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MilesByUnitListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MilesStoreService } from './miles.service';
import { MilesTableStore } from './miles.store';

@Injectable({
    providedIn: 'root',
})
export class MilesResolverService implements Resolve<any> {
    constructor(private milesStoreService: MilesStoreService, private store: MilesTableStore) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        return this.milesStoreService.getMiles().pipe(
            catchError(() => {
                return of('No miles data...');
            }),
            tap((milesList: MilesByUnitListResponse) => {
                localStorage.setItem(
                    'milesTableCount',
                    JSON.stringify({
                        active: milesList.activeTruckCount,
                        inactive: milesList.inactiveTruckCount,
                    })
                );

                this.store.set(milesList.pagination.data);
            })
        );
        //return of();
    }
}
