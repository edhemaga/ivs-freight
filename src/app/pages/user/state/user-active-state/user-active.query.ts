import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserActiveState, UserActiveStore } from '@pages/user/state/user-active-state/user-active.store';

@Injectable({ providedIn: 'root' })
export class UserActiveQuery extends QueryEntity<UserActiveState> {
    constructor(protected userStore: UserActiveStore) {
        super(userStore);
    }
}
