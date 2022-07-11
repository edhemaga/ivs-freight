
import { DriverResponse } from './../../../../../../../appcoretruckassist/model/driverResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';


export interface DriverMinimalListState extends EntityState<DriverResponse,number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'driverMinimalList' })
export class DriversMinimalListStore extends EntityStore<DriverMinimalListState> {
  constructor() {
    super();
  }
}
