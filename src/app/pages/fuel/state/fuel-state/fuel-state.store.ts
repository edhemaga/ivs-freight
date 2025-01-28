import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface FuelState extends EntityState<any> {}

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
