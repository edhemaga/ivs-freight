import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserInactiveState, UserInactiveStore } from '@pages/user/state/user-inactive-state/user-inactive.store';

@Injectable({ providedIn: 'root' })
export class UserInactiveQuery extends QueryEntity<UserInactiveState> {
    constructor(protected userStore: UserInactiveStore) {
        super(userStore);
    }
}
