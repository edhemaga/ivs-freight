import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FuelStateModal } from './fuel-state.model';

export interface FuelState extends EntityState<FuelStateModal> {}

export const initialState = (): FuelState => {
  return {
    fuelTransactions: [],
    fuelStops: [],
  };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'fuel' })
export class FuelStore extends EntityStore<FuelState> {
  constructor() {
    super(initialState());
  }
}
