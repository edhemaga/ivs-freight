import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RepairDetailsState, RepairDetailsStore } from './repair-details.store';

@Injectable({ providedIn: 'root' })
export class RepairDetailsQuery extends QueryEntity<RepairDetailsState> {
  repairDetails$ = this.select('repairDetails');

  constructor(protected repairDetailsStore: RepairDetailsStore) {
    super(repairDetailsStore);
  }
}
