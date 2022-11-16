import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RepairTruckState, RepairTruckStore } from './repair-truck.store';

@Injectable({ providedIn: 'root' })
export class RepairTruckQuery extends QueryEntity<RepairTruckState> {
  constructor(protected repairTruckStore: RepairTruckStore) {
    super(repairTruckStore);
  }
}
