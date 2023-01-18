import { Injectable } from '@angular/core';

import { QueryEntity } from '@datorama/akita';
import { PayrollState, PayrollStore } from './payroll.store';

@Injectable({
    providedIn: 'root',
})
export class PayrollQuery extends QueryEntity<PayrollState> {
    //selectDashboardStatistic$ = this.select('statistic');

    payrolldata$ = this.selectAll();

    constructor(protected store: PayrollStore) {
        super(store);
    }

    get dashboardStatistics() {
        return this.getValue();
    }
}
