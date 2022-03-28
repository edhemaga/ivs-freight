import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Driver } from './driver.model';

export interface DriversState extends EntityState<Driver, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'drivers' })
export class DriversStore extends EntityStore<DriversState> {
  constructor() {
    super();
  }
}
