import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DriverShortResponse } from 'appcoretruckassist';

export interface DriversState extends EntityState<DriverShortResponse[], number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'drivers' })
export class DriversStore extends EntityStore<DriversState> {
  constructor() {
    super();
  }
}
