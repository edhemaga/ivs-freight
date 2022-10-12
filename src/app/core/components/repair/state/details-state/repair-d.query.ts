import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RepairDState, RepairDStore } from './repair-d.store';

@Injectable({ providedIn: 'root' })
export class RepairDQuery extends QueryEntity<RepairDState> {
  repairShop$ = this.select('repairShop');

  repairList$ = this.select('repairList');

  repairShopMinimal$ = this.select('repairShopMinimal');

  constructor(protected repairDStore: RepairDStore) {
    super(repairDStore);
  }
}
