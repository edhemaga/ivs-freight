import { Injectable } from '@angular/core';

// Store
import { PayrollStore } from '@pages/accounting/pages/payroll/state/payroll.store';

// Services
import { PayrollService as PayrollMainService } from 'appcoretruckassist';

// Constants
import { PayrollDriverMilesTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-miles-table-settings.constants';
import { PayrollDriverCommisionTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-driver-commision-table-settings.constants';
import { PayrollOwnerTableSettingsConstants } from '@pages/accounting/utils/constants/payroll-owner-table-settings.constants';

@Injectable({ providedIn: 'root' })
export class PayrollService {
    payrollData = {
        payrollDriverCommissions: {
            title: 'Driver (Commission)',
            short_title: 'Driver (%)',
            count: 'payrollDriverCommissionsCount',
        },
        payrollDriverMileages: {
            title: 'Driver (Mile)',
            short_title: 'Driver (Mile)',
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
        //return this.payrollService.apiPayrollDriverCommissionGet(id);
    }
    // This gives error as with getPayrollOwnerOpenReport
    getPayrollMileageDriverOpenReport() {
        // return this.payrollService.apiPayrollDriverMileageIdGet(id);
    }

    getPayrollList() {
        // return this.payrollService.apiPayrollListGet();
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
            case 'Driver (Mile)':
                return PayrollDriverMilesTableSettingsConstants;
            case 'Driver (Commission)':
                return PayrollDriverCommisionTableSettingsConstants;
            case 'Owner':
                return PayrollOwnerTableSettingsConstants;
        }
    }
}
