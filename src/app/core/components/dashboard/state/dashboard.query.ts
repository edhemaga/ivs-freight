import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import { combineLatest } from 'rxjs';
import { DashboardState, DashboardStore } from './dashboard.store';

@Injectable({
  providedIn: 'root'
})
export class DashboardQuery extends QueryEntity<DashboardState> {
  selectDashboardStatistic$ = this.select('statistic');

  constructor(protected store: DashboardStore) {
    super(store);
  }

  get dashboardStatistics(){
    return this.getValue().statistic;
  }
}
