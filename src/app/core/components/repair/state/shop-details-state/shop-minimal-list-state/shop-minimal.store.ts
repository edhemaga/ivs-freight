import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import {
  RepairShopMinimalListResponse,
  RepairShopMinimalResponse,
  RepairShopResponse,
} from 'appcoretruckassist';

export interface RepairShopMinimalListState
  extends EntityState<RepairShopMinimalResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairShopMinimalList' })
export class RepairShopMinimalListStore extends EntityStore<RepairShopMinimalListState> {
  constructor() {
    super();
  }
}
