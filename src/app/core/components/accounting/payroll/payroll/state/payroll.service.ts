import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PayrollStore } from './payroll.store';
import { PayrollService } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class PayrollStoreService {
    payrollData = {
        payrollDriverCommissions: {
            title: 'Driver (Commission)',
            count: 'payrollDriverCommissionsCount',
        },
        payrollDriverMileages: {
            title: 'Driver (Miles)',
            count: 'payrollDriverMileagesCount',
        },
        payrollOwners: {
            title: 'Owner',
            count: 'payrollOwnersCount',
        },
    };

    constructor(
        private payrollStore: PayrollStore,
        private ps: PayrollService
    ) {}

    getPayrollList() {
        return this.ps.apiPayrollListGet();
    }

    set payrollList(data) {
        let payrollData = [];
        Object.keys(data).map((item) => {
            if (this.payrollData[item]) {
                payrollData.push({
                    title: this.payrollData[item].title,
                    data: data[item].data,
                    count: data[this.payrollData[item].count],
                });
            }
        });

        console.log('TEST');
        console.log(payrollData);
        this.payrollStore.set({ ...payrollData }); // NEVEROVATNO ALI SAMO OVAKO RADI :)
    }
}
