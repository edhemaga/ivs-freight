import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// models
import { FuelStopResponse } from 'appcoretruckassist';

// services
import { FuelService } from '@shared/services/fuel.service';

// store
import { FuelItemStore } from '@pages/fuel/state/fuel-details-item-state/fuel-details-item.store';
import { FuelDetailsStore } from '@pages/fuel/state/fuel-details-state/fuel-details.store';

@Injectable({
    providedIn: 'root',
})
export class FuelDetailsResolver {
    public pageIndex: number = 1;
    public pageSize: number = 25;

    constructor(
        private router: Router,

        // services
        private fuelService: FuelService,

        // store
        private fuelItemStore: FuelItemStore,
        private fuelDetailsStore: FuelDetailsStore
    ) {}
    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const fuelStopId = +route.paramMap.get('id');

        return this.fuelService.getFuelStopById(fuelStopId).pipe(
            tap((fuelResponse: FuelStopResponse) => {
                this.fuelDetailsStore.add(fuelResponse);
                this.fuelItemStore.set([fuelResponse]);
            }),
            catchError(() => {
                this.router.navigate(['/fuel']);

                return of('No fuel data for...' + fuelStopId);
            })
        );
    }
}
