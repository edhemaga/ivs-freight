import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PayrollStore } from './payroll.store';
//import { PayrollService } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class PayrollStoreService {
    constructor(
        private payrollStore: PayrollStore,
        //private ps: PayrollService
    ) {}

    getPayrollList() {
      // return this.ps.apiPayrollListGet();
    }

    set dashStats(response) {
        // this.dashboardStore.update((store) => ({
        //     ...store,
        //     statistic: response,
        // }));
    }
}
