import { ParkingResponse } from './../../../../../../../../appcoretruckassist/model/parkingResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface ParkingState extends EntityState<ParkingResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'parkingStore' })
export class ParkingStore extends EntityStore<ParkingState> {
  constructor() {
    super();
  }
}
