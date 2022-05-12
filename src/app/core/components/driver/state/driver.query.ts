import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DriversState, DriversStore } from './driver.store';

@Injectable({ providedIn: 'root' })
export class DriversQuery extends QueryEntity<DriversState> {
  constructor(protected driverStore: DriversStore) {
    super(driverStore);
  }

  // Call Delete Driver
  // public deleteDriverByIdFromStore(id: number) {
  //   const index = this.driverStore
  //     .getValue()
  //     .entities.entities.findIndex((driver) => driver.id === id);

  //   this.driverStore.remove(index);

  //   console.log('Store After Delete');
  //   console.log(this.driverStore.getValue());
  // }

}
