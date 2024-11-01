import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

//Models
import { FuelState as FuelStateModel } from '@pages/fuel/models/fuel-state.model';

export interface FuelState extends EntityState<FuelStateModel> {}

export const initialState = (): FuelState => {
    return {
        fuelTransactions: null,
        fuelStops: null,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuel' })
export class FuelStore extends EntityStore<FuelState> {
    constructor() {
        super(initialState());
    }
}
