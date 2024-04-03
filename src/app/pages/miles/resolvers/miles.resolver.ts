import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// services
import { MilesStoreService } from '../services/miles-store.service';

//s tore
import { MilesTableStore } from '../state/miles.store';

@Injectable({
    providedIn: 'root',
})
export class MilesResolver implements Resolve<any> {
    constructor(
        private milesStoreService: MilesStoreService,
        private store: MilesTableStore
    ) {}
    resolve(): Observable<any> {
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
