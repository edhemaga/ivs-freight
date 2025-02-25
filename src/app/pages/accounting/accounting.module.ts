import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '@shared/shared.module';
import { AccountingRoutingModule } from '@pages/accounting/accounting-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Store
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

// Components
import {
    CaMapComponent,
    CaMainTableComponent,
    CaPeriodContentComponent,
    CaPayrollListSummaryOverviewComponent,
    CaProfileImageComponent,
    CaSearchMultipleStatesComponent,
    CaFilterComponent,
    CaDropdownMenuComponent,
} from 'ca-components';

import { PayrollComponent } from '@pages/accounting/pages/payroll/payroll.component';
import { AccountingPayrollComponent } from '@pages/accounting/pages/accounting-payroll/accounting-payroll.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { DriverMileageCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-collapsed-table/driver-mileage-collapsed-table.component';

import { DriverCommissionCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-collapsed-table/driver-commission-collapsed-table.component';
import { DriverFlatRateCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-collapsed-table/driver-flat-rate-collapsed-table.component';
import { DriverOwnerCollapsedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-collapsed-table/driver-owner-collapsed-table.component';
import { DriverCommissionExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-expanded-table/driver-commission-expanded-table.component';
import { DriverFlatRateExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-expanded-table/driver-flat-rate-expanded-table.component';
import { DriverOwnerExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-expanded-table/driver-owner-expanded-table.component';
import { DriverMileageExpandedTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-expanded-table/driver-mileage-expanded-table.component';
import { DriverCommissionSoloTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-commission/driver-commission-solo-table/driver-commission-solo-table.component';
import { DriverOwnerTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-owner/driver-owner-table/driver-owner-table.component';
import { DriverFlatRateTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-table/driver-flat-rate-table.component';
import { PayrollReportComponent } from '@pages/accounting/pages/payroll/components/reports/payroll-report/payroll-report.component';
import { DriverCommissionReportComponent } from '@pages/accounting/pages/payroll/components/reports/driver-commission-report/driver-commission-report.component';
import { PayrollToolbarComponent } from '@pages/accounting/pages/payroll/components/payroll-toolbar/payroll-toolbar.component';
import { DriverOwnerReportComponent } from '@pages/accounting/pages/payroll/components/reports/driver-owner-report/driver-owner-report.component';
import { DriverFlatRateReportComponent } from '@pages/accounting/pages/payroll/components/reports/driver-flat-rate-report/driver-flat-rate-report.component';
import { TaAppTooltipComponent } from '@shared/components/ta-app-tooltip/ta-app-tooltip.component';

// Pipes
import { payrollReducer } from '@pages/accounting/pages/payroll/state/reducers/payroll.reducer';
import { PayrollEffect } from '@pages/accounting/pages/payroll/state/effects';
import { DriverMileageSoloTableComponent } from '@pages/accounting/pages/payroll/components/tables/driver-mileage/driver-mileage-solo-table/driver-mileage-solo-table.component';
import {
    PayrollTableTotalPipe,
    PayrollTableCommissionTotalPipe,
} from '@pages/accounting/pages/payroll/pipes';
import { ListNameCasePipe } from '@shared/components/ta-table/ta-table-toolbar/pipes/list-name-case.pipe';

@NgModule({
    declarations: [
        // Components
        PayrollComponent,
        AccountingPayrollComponent,
        PayrollReportComponent,

        // Pipes
        DriverMileageSoloTableComponent,
        PayrollTableTotalPipe,
        PayrollTableCommissionTotalPipe,

        // Components
        DriverMileageCollapsedTableComponent,
        DriverMileageExpandedTableComponent,
        DriverCommissionSoloTableComponent,
        DriverOwnerTableComponent,
        DriverFlatRateTableComponent,
        DriverCommissionReportComponent,
        DriverOwnerReportComponent,
        DriverFlatRateReportComponent,
        DriverCommissionCollapsedTableComponent,
        DriverFlatRateCollapsedTableComponent,
        DriverOwnerCollapsedTableComponent,
        DriverCommissionExpandedTableComponent,
        DriverFlatRateExpandedTableComponent,
        DriverOwnerExpandedTableComponent,
        PayrollToolbarComponent,
    ],
    imports: [
        // Modules
        CommonModule,
        AccountingRoutingModule,
        SharedModule,
        AngularSvgIconModule,

        // Pipes
        ListNameCasePipe,

        // Components
        TaAppTooltipComponent,
        TaTableToolbarComponent,
        CaSearchMultipleStatesComponent,
        CaDropdownMenuComponent,
        TaInputComponent,
        TaProfileImagesComponent,
        TaCustomCardComponent,
        CaFilterComponent,
        EffectsModule.forFeature([PayrollEffect]),
        StoreModule.forFeature('payroll', payrollReducer),
        CaMainTableComponent,
        CaMapComponent,
        CaMainTableComponent,
        CaPeriodContentComponent,
        CaPayrollListSummaryOverviewComponent,
        CaProfileImageComponent,
    ],
    exports: [],
})
export class AccountingModule {}
