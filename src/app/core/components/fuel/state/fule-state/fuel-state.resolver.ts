import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FuelTService } from '../fuel.service';
import { FuelState } from './fuel-state.store';

@Injectable({
    providedIn: 'root',
})
export class FuelResolver implements Resolve<FuelState> {
    constructor(private fuelService: FuelTService) {}

    resolve(): Observable<FuelState> {
        const fuelTransactions$ = this.fuelService.getFuelTransactionsList(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            1,
            25
        );

        const fuelStops$ = this.fuelService.getFuelStopsList(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            1,
            25
        );

        return forkJoin({
            fuelTransactions: fuelTransactions$,
            fuelStops: fuelStops$,
        }).pipe(
            tap((data) => {
                localStorage.setItem(
                    'fuelTableCount',
                    JSON.stringify({
                        fuelTransactions:
                            data.fuelTransactions.pagination.count,
                        fuelStops: data.fuelStops.pagination.count,
                    })
                );

                this.fuelService.updateStoreFuelTransactionsList =
                    data.fuelTransactions;
                this.fuelService.updateStoreFuelStopList = data.fuelStops;
            })
        );
    }
}
