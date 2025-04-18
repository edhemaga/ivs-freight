import { Injectable } from '@angular/core';

// Services
import { UserStoreService } from '@pages/new-user/state/services/user-store.service';

@Injectable({
    providedIn: 'root',
})
export class UserResolver {
    constructor(private userStoreService: UserStoreService) {}

    resolve(): void {
        return this.userStoreService.dispatchLoadInitialList();
    }
}
