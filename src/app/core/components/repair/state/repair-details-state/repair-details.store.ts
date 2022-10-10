import { RepairShopResponse } from '../../../../../../../appcoretruckassist/model/repairShopResponse';
import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RepairResponsePagination } from 'appcoretruckassist';

export interface RepairDetailsState
  extends EntityState<RepairResponsePagination, any> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairDetails' })
export class RepairDetailsStore extends EntityStore<RepairDetailsState> {
  constructor() {
    super();
  }
}
