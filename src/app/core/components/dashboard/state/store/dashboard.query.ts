import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';

import { DashboardStore, DashboardState } from './dashboard.store';

@Injectable({ providedIn: 'root' })
export class DashboardQuery extends QueryEntity<DashboardState> {
    public companyDuration$ = this.select('companyDuration');

    constructor(protected dashboardStore: DashboardStore) {
        super(dashboardStore);
    }
}
