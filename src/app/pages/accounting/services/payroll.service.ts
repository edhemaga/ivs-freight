import { Injectable } from '@angular/core';
import { PayrollStore } from '../pages/payroll/payroll/state/payroll.store';
import { PayrollService } from 'appcoretruckassist';
import { driver_miles_table_settings } from '../utils/constants/driver_miles.constants';
import { driver_commision_table_settings } from '../utils/constants/driver_commision.constants';
import { owner_table_settings } from '../utils/constants/owner.constants';

@Injectable({ providedIn: 'root' })
export class PayrollStoreService {
    payrollData = {
        payrollDriverCommissions: {
            title: 'Driver (Commission)',
            short_title: 'Driver (%)',
            count: 'payrollDriverCommissionsCount',
        },
        payrollDriverMileages: {
            title: 'Driver (Miles)',
            short_title: 'Driver (Miles)',
            count: 'payrollDriverMileagesCount',
        },
        payrollOwners: {
            title: 'Owner',
            short_title: 'Owner',
            count: 'payrollOwnersCount',
        },
    };

    constructor(
        private payrollStore: PayrollStore,
        private ps: PayrollService
    ) {}

    // This gives error changed on back check what it is
    getPayrollOwnerOpenReport(id: number) {
        // return this.ps.apiPayrollOwnerIdGet(id);
    }

    getPayrollCommisionDriverOpenReport(id: number) {
        return this.ps.apiPayrollDriverCommissionGet(id);
    }
    // This gives error as with getPayrollOwnerOpenReport
    getPayrollMileageDriverOpenReport(id: number) {
        // return this.ps.apiPayrollDriverMileageIdGet(id);
    }

    getPayrollList() {
        return this.ps.apiPayrollListGet();
    }

    set payrollList(data) {
        let payrollData = [];
        Object.keys(data).map((item) => {
            if (data[item] && this.payrollData[item]) {
                payrollData.push({
                    title: this.payrollData[item].title,
                    short_title: this.payrollData[item].short_title,
                    data: data[item].pagination.data,
                    count: data[item].pagination.count,
                    tableSettings: this.getTableDefinitions(
                        this.payrollData[item].title
                    ),
                });
            }
        });

        this.payrollStore.set({ ...payrollData }); // NEVEROVATNO ALI SAMO OVAKO RADI :)
    }

    getTableDefinitions(title) {
        switch (title) {
            case 'Driver (Miles)':
                return driver_miles_table_settings;
            case 'Driver (Commission)':
                return driver_commision_table_settings;
            case 'Owner':
                return owner_table_settings;
        }
    }
}
