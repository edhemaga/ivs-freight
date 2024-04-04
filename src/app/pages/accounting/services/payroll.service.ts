import { Injectable } from '@angular/core';

// Store
import { PayrollStore } from '../pages/payroll/state/payroll.store';

// Services
import { PayrollService as PayrollMainService } from 'appcoretruckassist';

// Constants
import { DriverMilesTableSettings } from '../utils/constants/driver-miles-table-settings.constants';
import { DriverCommisionTableSettings } from '../utils/constants/driver-commision-table-settings.constants';
import { OwnerTableSettings } from '../utils/constants/owner-table-settings.constants';

@Injectable({ providedIn: 'root' })
export class PayrollService {
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
        // Store
        private payrollStore: PayrollStore,

        // Services
        private payrollService: PayrollMainService
    ) {}

    // This gives error changed on back check what it is
    getPayrollOwnerOpenReport() {
        // return this.payrollService.apiPayrollOwnerIdGet(id);
    }

    getPayrollCommisionDriverOpenReport(id: number) {
        return this.payrollService.apiPayrollDriverCommissionGet(id);
    }
    // This gives error as with getPayrollOwnerOpenReport
    getPayrollMileageDriverOpenReport() {
        // return this.payrollService.apiPayrollDriverMileageIdGet(id);
    }

    getPayrollList() {
        return this.payrollService.apiPayrollListGet();
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
                return DriverMilesTableSettings;
            case 'Driver (Commission)':
                return DriverCommisionTableSettings;
            case 'Owner':
                return OwnerTableSettings;
        }
    }
}
