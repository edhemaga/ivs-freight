import { Injectable } from '@angular/core';
import { PayrollStore } from './payroll.store';
import { PayrollService } from 'appcoretruckassist';
import { driver_miles_table_settings } from './table-settings/driver_miles';
import { driver_commision_table_settings } from './table-settings/driver_commision';
import { owner_table_settings } from './table-settings/owner';

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
                    tableSettings: this.getTableDefinitions(this.payrollData[item].title)
                });
            }
        });

        this.payrollStore.set({ ...payrollData }); // NEVEROVATNO ALI SAMO OVAKO RADI :)
    }

    getTableDefinitions(title){
        switch(title){
            case "Driver (Miles)":
                return driver_miles_table_settings;
            case "Driver (Commission)":
                return driver_commision_table_settings;
            case "Owner":
                return owner_table_settings;
        }
    }
}
