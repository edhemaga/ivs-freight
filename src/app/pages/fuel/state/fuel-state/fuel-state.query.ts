import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    FuelState,
    FuelStore,
} from '@pages/fuel/state/fuel-state/fuel-state.store';

// rxjs
import { Observable } from 'rxjs';

// models
import { FuelStopListResponse, FuelTransactionListResponse } from 'appcoretruckassist';

// constants
import { FuelStateQueryConstants } from '@pages/fuel/state/fuel-state/utils/constants/fuel-state-query.constants';

@Injectable({ providedIn: 'root' })
export class FuelQuery extends QueryEntity<FuelState> {
    public fuelTransactions$: Observable<FuelTransactionListResponse> = this.select(FuelStateQueryConstants.FUEL_TRANSACTIONS_QUERY_KEY) as Observable<FuelTransactionListResponse>;
    public fuelStops$: Observable<FuelStopListResponse> = this.select(FuelStateQueryConstants.FUEL_STOPS_QUERY_KEY) as Observable<FuelStopListResponse>;

    constructor(protected fuelStore: FuelStore) {
        super(fuelStore);
    }
}
