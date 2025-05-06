import { Injectable } from '@angular/core';

// Services
import { AccountStoreService } from '@pages/new-account/state/services/account-store.service';

@Injectable({
    providedIn: 'root',
})
export class AccountResolver {
    constructor(private accountStoreService: AccountStoreService) {}

    resolve(): void {
        return this.accountStoreService.loadAccounts();
    }
}
