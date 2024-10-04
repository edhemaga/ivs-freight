import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyUserResponse } from 'appcoretruckassist';

export interface UserInactiveState extends EntityState<CompanyUserResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserInactiveStore extends EntityStore<UserInactiveState> {
    constructor() {
        super();
    }
}
