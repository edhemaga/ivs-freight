import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RepairTrailerState, RepairTrailerStore } from './repair-trailer.store';

@Injectable({ providedIn: 'root' })
export class RepairTrailerQuery extends QueryEntity<RepairTrailerState> {
   constructor(protected repairTrailerStore: RepairTrailerStore) {
      super(repairTrailerStore);
   }
}
