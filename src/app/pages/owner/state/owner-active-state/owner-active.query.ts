import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {
    OwnerActiveState,
    OwnerActiveStore,
} from '@pages/owner/state/owner-active-state/owner-active.store';

@Injectable({ providedIn: 'root' })
export class OwnerActiveQuery extends QueryEntity<OwnerActiveState> {
    constructor(protected ownerStore: OwnerActiveStore) {
        super(ownerStore);
    }
}
