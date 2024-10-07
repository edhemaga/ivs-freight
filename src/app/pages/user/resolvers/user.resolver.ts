import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

// services
import { UserService } from '@pages/user/services/user.service';

// store
import { UserActiveStore } from '@pages/user/state/user-active-state/user-active.store';

@Injectable({
    providedIn: 'root',
})
export class UserResolver {
    constructor(
        private userService: UserService,
        private userStore: UserActiveStore
    ) {}
    resolve(): Observable<any> {
        return this.userService.getUsers(1, 1, 25).pipe(
            tap((userPagination) => {
                localStorage.setItem(
                    'userTableCount',
                    JSON.stringify({
                        active: userPagination.activeCount,
                        inactive: userPagination.inactiveCount,
                    })
                );

                this.userStore.set(userPagination.pagination.data);
            })
        );
    }
}
