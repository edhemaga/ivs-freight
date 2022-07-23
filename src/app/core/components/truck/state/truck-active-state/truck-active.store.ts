import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TruckShortResponse } from 'appcoretruckassist';

export interface TruckActiveState extends EntityState<TruckShortResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckActive' })
export class TruckActiveStore extends EntityStore<TruckActiveState> {
  constructor() {
    super();
  }
}
