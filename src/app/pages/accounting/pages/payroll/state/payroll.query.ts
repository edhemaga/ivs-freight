import { Injectable } from '@angular/core';

// Akita
import { QueryEntity } from '@datorama/akita';

// Store
import { PayrollState, PayrollStore } from './payroll.store';

@Injectable({
    providedIn: 'root',
})
export class PayrollQuery extends QueryEntity<PayrollState> {
    payrolldata$ = this.selectAll();

    constructor(protected store: PayrollStore) {
        super(store);
    }

    get dashboardStatistics() {
        return this.getValue();
    }
}
