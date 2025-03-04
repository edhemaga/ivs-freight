import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    FuelState,
    FuelStore,
} from '@pages/fuel/state/fuel-state/fuel-state.store';

// rxjs
import { Observable } from 'rxjs';

// models
import {
    FuelStopListResponse,
    FuelTransactionListResponse,
} from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class FuelQuery extends QueryEntity<FuelState> {
    public fuelTransactions$: Observable<FuelTransactionListResponse> =
        this.select(
            'fuelTransactions'
        ) as Observable<FuelTransactionListResponse>;

    public fuelStops$: Observable<FuelStopListResponse> = this.select(
        'fuelStops'
    ) as Observable<FuelStopListResponse>;

    constructor(protected fuelStore: FuelStore) {
        super(fuelStore);
    }
}
