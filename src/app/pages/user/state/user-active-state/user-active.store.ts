import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CompanyUserResponse } from 'appcoretruckassist';

export interface UserActiveState
    extends EntityState<CompanyUserResponse, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user' })
export class UserActiveStore extends EntityStore<UserActiveState> {
    constructor() {
        super();
    }
}
