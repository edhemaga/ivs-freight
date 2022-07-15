import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
  RepairShopMinimalListState,
  RepairShopMinimalListStore,
} from './shop-minimal.store';

@Injectable({ providedIn: 'root' })
export class RepairShopMinimalListQuery extends QueryEntity<RepairShopMinimalListState> {
  constructor(
    protected repairShopMinimalListStore: RepairShopMinimalListStore
  ) {
    super(repairShopMinimalListStore);
  }
}
