import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoadsideInspectionResponse } from 'appcoretruckassist';

export interface RoadsideInactiveState extends EntityState<RoadsideInspectionResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roadsideInactive' })
export class RoadsideInactiveStore extends EntityStore<RoadsideInactiveState> {
  constructor() {
    super();
  }
}
