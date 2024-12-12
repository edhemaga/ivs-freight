import { Injectable } from '@angular/core';

import { Observable, tap, forkJoin } from 'rxjs';

// services
import { UserService } from '@pages/user/services/user.service';

// store
import { UserActiveStore } from '@pages/user/state/user-active-state/user-active.store';
import { UserInactiveStore } from '@pages/user/state/user-inactive-state/user-inactive.store';

@Injectable({
    providedIn: 'root',
})
export class UserResolver {
    constructor(
        private userService: UserService,
        private userActiveStore: UserActiveStore,
        private userInactiveStore: UserInactiveStore
    ) {}
    resolve(): Observable<any> {
        return forkJoin([
            this.userService.getUsers(1, 1, 25),
            this.userService.getUsers(2, 1, 25),
        ]).pipe(
            tap(([activeUsers, inactiveUsers]) => {
                localStorage.setItem(
                    'userTableCount',
                    JSON.stringify({
                        active: activeUsers.activeCount,
                        inactive: activeUsers.inactiveCount,
                    })
                );

                this.userActiveStore.set(activeUsers.pagination.data);
                this.userInactiveStore.set(inactiveUsers.pagination.data);
            })
        );
    }
}
