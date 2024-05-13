import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UserState, UserStore } from '@pages/user/state/user.store';

@Injectable({ providedIn: 'root' })
export class UserQuery extends QueryEntity<UserState> {
    constructor(protected userStore: UserStore) {
        super(userStore);
    }
}
