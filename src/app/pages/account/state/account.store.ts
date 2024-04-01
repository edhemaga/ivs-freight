import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyAccountResponse } from 'appcoretruckassist';

export interface AccountState extends EntityState<CompanyAccountResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'account' })
export class AccountStore extends EntityStore<AccountState> {
    constructor() {
        super();
    }
}
