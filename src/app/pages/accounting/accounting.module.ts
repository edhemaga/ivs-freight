import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

// Modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// Components
import { PayrollComponent } from './pages/payroll/payroll.component';
import { AccountingPayrollComponent } from './pages/accounting-payroll/accounting-payroll.component';
import { PayrollTableComponent } from './pages/payroll/components/payroll-table/payroll-table.component';
import { PayrollReportComponent } from './pages/payroll/components/payroll-report/payroll-report.component';
import { PayrollSmallTablesComponent } from './pages/payroll/components/payroll-small-tables/payroll-small-tables.component';
import { TaTruckassistTableToolbarComponent } from 'src/app/shared/components/ta-truckassist-table/ta-truckassist-table-toolbar/ta-truckassist-table-toolbar.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { TaProfileImagesComponent } from 'src/app/shared/components/ta-profile-images/ta-profile-images.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';

// Pipes
import { PayrollTablePipe } from './pages/payroll/components/payroll-table/pipes/payroll-table.pipe';
import { PayrollRowBorderTablePipe } from './pages/payroll/components/payroll-table/pipes/payroll-row-border.pipe';

@NgModule({
    declarations: [
        // Components
        PayrollComponent,
        AccountingPayrollComponent,
        PayrollTableComponent,
        PayrollReportComponent,
        PayrollSmallTablesComponent,

        // Pipes
        PayrollRowBorderTablePipe,
        PayrollTablePipe,
    ],
    imports: [
        // Modules
        CommonModule,
        AccountingRoutingModule,
        SharedModule,
        AngularSvgIconModule,
        AgmCoreModule,
        TaTruckassistTableToolbarComponent,
        TaInputComponent,
        TaProfileImagesComponent,
        TaCustomCardComponent,
    ],
    exports: [PayrollTableComponent],
})
export class AccountingModule {}
