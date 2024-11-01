import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { SharedModule } from '@shared/shared.module';
import { AccountingRoutingModule } from '@pages/accounting/accounting-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import {
    CaMapComponent,
    CaMainTableComponent,
    CaPeriodContentComponent,
    CaPayrollListSummaryOverviewComponent,
    CaProfileImageComponent,
} from 'ca-components';
import { PayrollComponent } from '@pages/accounting/pages/payroll/payroll.component';
import { AccountingPayrollComponent } from '@pages/accounting/pages/accounting-payroll/accounting-payroll.component';
import { TaTableToolbarComponent } from '@shared/components/ta-table/ta-table-toolbar/ta-table-toolbar.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { DriverMileageCollapsedTableComponent } from './pages/payroll/components/tables/driver-mileage/driver-mileage-collapsed-table/driver-mileage-collapsed-table.component';

import { DriverMileageExpandedTableComponent } from './pages/payroll/components/tables/driver-mileage/driver-mileage-expanded-table/driver-mileage-expanded-table.component';
import { DriverCommissionSoloTableComponent } from './pages/payroll/components/tables/driver-commission/driver-commission-solo-table/driver-commission-solo-table.component';
import { DriverOwnerTableComponent } from './pages/payroll/components/tables/driver-owner/driver-owner-table/driver-owner-table.component';
import { DriverFlatRateTableComponent } from './pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-table/driver-flat-rate-table.component';
import { PayrollReportComponent } from './pages/payroll/components/reports/payroll-report/payroll-report.component';
import { DriverCommissionReportComponent } from './pages/payroll/components/reports/driver-commission-report/driver-commission-report.component';
import { PayrollTableCommissionTotalPipe } from './pages/payroll/pipes/payroll-table-commission-total/payroll-table-commission-total.pipe';
import { DriverOwnerReportComponent } from './pages/payroll/components/reports/driver-owner-report/driver-owner-report.component';
import { DriverFlatRateReportComponent } from './pages/payroll/components/reports/driver-flat-rate-report/driver-flat-rate-report.component';

// Pipes
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { payrollReducer } from './pages/payroll/state/reducers/payroll.reducer';
import { PayrollEffect } from './pages/payroll/state/effects/payroll.effect';
import { PayrollTableNamesPipe } from './pages/payroll/pipes/payroll-table-names/payroll-table-names.pipe';
import { DriverMileageSoloTableComponent } from './pages/payroll/components/tables/driver-mileage/driver-mileage-solo-table/driver-mileage-solo-table.component';
import { PayrollTableTotalPipe } from './pages/payroll/pipes/payroll-table-total/payroll-table-total.pipe';
import { DriverCommissionCollapsedTableComponent } from './pages/payroll/components/tables/driver-commission/driver-commission-collapsed-table/driver-commission-collapsed-table.component';
import { DriverFlatRateCollapsedTableComponent } from './pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-collapsed-table/driver-flat-rate-collapsed-table.component';
import { DriverOwnerCollapsedTableComponent } from './pages/payroll/components/tables/driver-owner/driver-owner-collapsed-table/driver-owner-collapsed-table.component';
import { DriverCommissionExpandedTableComponent } from './pages/payroll/components/tables/driver-commission/driver-commission-expanded-table/driver-commission-expanded-table.component';
import { DriverFlatRateExpandedTableComponent } from './pages/payroll/components/tables/driver-flat-rate/driver-flat-rate-expanded-table/driver-flat-rate-expanded-table.component';
import { DriverOwnerExpandedTableComponent } from './pages/payroll/components/tables/driver-owner/driver-owner-expanded-table/driver-owner-expanded-table.component';
@NgModule({
    declarations: [
        // Components
        PayrollComponent,
        AccountingPayrollComponent,
        PayrollReportComponent,

        // Pipes
        PayrollTableNamesPipe,
        DriverMileageSoloTableComponent,
        PayrollTableTotalPipe,
        PayrollTableCommissionTotalPipe,
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
        DriverOwnerExpandedTableComponent
    ],
    imports: [
        // Modules
        CommonModule,
        AccountingRoutingModule,
        SharedModule,
        AngularSvgIconModule,
        //AgmCoreModule,
        TaTableToolbarComponent,
        TaInputComponent,
        TaProfileImagesComponent,
        TaCustomCardComponent,
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
