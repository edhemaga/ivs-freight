import { IDashboard } from './dashboard.model';

import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface DashboardState extends EntityState<IDashboard, string> {}

export function createInitialState(): DashboardState {
    return {
        statistic: {
            todayObject: null,
            mtdObject: [],
            ytdObject: [], 
            allTimeObject: []
        }
    };
  }

@Injectable({
    providedIn: 'root'
})
@StoreConfig({ name: 'dashboard' })
export class DashboardStore extends EntityStore<DashboardState> {
    constructor() {
        super(createInitialState());
    }
}