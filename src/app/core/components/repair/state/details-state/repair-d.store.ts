import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { IRepairD } from './repair-d.model';

export interface RepairDState extends EntityState<IRepairD> {}

export const initialState = (): RepairDState => {
  return {
    repairShop: [],
    repairList: [],
    repairShopMinimal: [],
  };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'repairD' })
export class RepairDStore extends EntityStore<RepairDState> {
  constructor() {
    super(initialState());
  }
}
