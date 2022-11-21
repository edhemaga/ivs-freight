import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TruckShortResponse } from 'appcoretruckassist';

export interface TruckInactiveState
  extends EntityState<TruckShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckInactive' })
export class TruckInactiveStore extends EntityStore<TruckInactiveState> {
  constructor() {
    super();
  }
}
