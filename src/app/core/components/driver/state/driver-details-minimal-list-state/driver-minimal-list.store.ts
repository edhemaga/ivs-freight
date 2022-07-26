import { DriverMinimalListResponse } from './../../../../../../../appcoretruckassist/model/driverMinimalListResponse';
import { DriverResponse } from './../../../../../../../appcoretruckassist/model/driverResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DriverMinimalResponse } from 'appcoretruckassist';

export interface DriverMinimalListState
  extends EntityState<DriverMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverMinimalList' })
export class DriversMinimalListStore extends EntityStore<DriverMinimalListState> {
  constructor() {
    super();
  }
}
