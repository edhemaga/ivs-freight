import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { OwnerInactiveState, OwnerInactiveStore } from './owner-inactive.store';

@Injectable({ providedIn: 'root' })
export class OwnerInactiveQuery extends QueryEntity<OwnerInactiveState> {
   constructor(protected ownerStore: OwnerInactiveStore) {
      super(ownerStore);
   }
}
