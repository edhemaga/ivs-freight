import { Injectable } from '@angular/core';

import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

import { IDashboardStore } from '../models/dashboard-store.model';

export interface DashboardState extends EntityState<IDashboardStore> {}

export const initialState = (): DashboardState => {
    return {
        companyDuration: null,
    };
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dashboard' })
export class DashboardStore extends EntityStore<DashboardState> {
    constructor() {
        super(initialState());
    }
}
