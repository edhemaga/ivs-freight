import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';

//Modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

//Components
import { AccountingIndexComponent } from './pages/accounting-index/accounting-index.component';
import { PayrollComponent } from './pages/payroll/payroll/payroll.component';
import { AccountingPayrollComponent } from './pages/accounting-payroll/accounting-payroll.component';
import { PayrollTableComponent } from './pages/payroll/payroll/payroll-table/payroll-table.component';
import { PayrollReportComponent } from './pages/payroll/payroll/payroll-report/payroll-report.component';
import { PayrollSmallTablesComponent } from './pages/payroll/payroll/payroll-small-tables/payroll-small-tables.component';
import { TruckassistTableToolbarComponent } from 'src/app/core/components/shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TaInputComponent } from 'src/app/shared/components/ta-input/ta-input.component';
import { ProfileImagesComponent } from 'src/app/core/components/shared/profile-images/profile-images.component';
import { TaCustomCardComponent } from 'src/app/shared/components/ta-custom-card/ta-custom-card.component';

//Helpers
import { PayrollTablePipe } from './pipes/payroll-table.pipe';
import { PayrollRowBorderTablePipe } from './pipes/payroll-row-border.pipe';

@NgModule({
    declarations: [
        AccountingIndexComponent,
        PayrollComponent,
        AccountingPayrollComponent,
        PayrollTableComponent,
        PayrollRowBorderTablePipe,
        PayrollTablePipe,
        PayrollReportComponent,
        PayrollSmallTablesComponent,
    ],
    imports: [
        CommonModule,
        AccountingRoutingModule,
        SharedModule,
        AngularSvgIconModule,
        AgmCoreModule,
        TruckassistTableToolbarComponent,
        TaInputComponent,
        ProfileImagesComponent,
        TaCustomCardComponent,
    ],
    exports: [AccountingIndexComponent, PayrollTableComponent],
})
export class AccountingModule {}
