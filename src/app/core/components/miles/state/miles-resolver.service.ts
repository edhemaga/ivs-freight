import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MilesStoreService } from './miles.service';
import { MilesTableStore } from './miles.store';

@Injectable({
    providedIn: 'root',
})
export class MilesResolverService implements Resolve<any> {
    constructor(
        private milesStoreService: MilesStoreService,
        private store: MilesTableStore
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const activeList = this.milesStoreService.getMiles(null, 1);
        const innactiveList = this.milesStoreService.getMiles(null, 0);

        return forkJoin([activeList, innactiveList]).pipe(
            map((list: any) => {
                localStorage.setItem(
                    'milesTableCount',
                    JSON.stringify({
                        active: list[0].activeTruckCount,
                        inactive: list[0].inactiveTruckCount,
                    })
                );
                this.store.set({
                    active: list[0].pagination.data,
                    innactive: list[1].pagination.data,
                });
                return list;
            })
        );
        //return of();
    }
}
