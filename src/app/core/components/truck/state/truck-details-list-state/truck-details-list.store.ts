import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TruckResponse } from '../../../../../../../appcoretruckassist/model/truckResponse';

export interface TruckDetailsListState
  extends EntityState<TruckResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'truckDetailsList' })
export class TrucksDetailsListStore extends EntityStore<TruckDetailsListState> {
  constructor() {
    super();
  }
}
