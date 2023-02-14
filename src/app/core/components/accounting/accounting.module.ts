import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingIndexComponent } from './accounting-index/accounting-index.component';
import { PayrollComponent } from './payroll/payroll/payroll.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { PayrollTableComponent } from './payroll/payroll/payroll-table/payroll-table.component';
import { PayrollTablePipe } from './payroll/payroll/pipe/payroll-table.pipe';
import { PayrollReportComponent } from './payroll/payroll/payroll-report/payroll-report.component';
import { PayrollSmallTablesComponent } from './payroll/payroll/payroll-small-tables/payroll-small-tables.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AgmCoreModule } from '@agm/core';
import { TruckassistTableToolbarComponent } from '../shared/truckassist-table/truckassist-table-toolbar/truckassist-table-toolbar.component';
import { TaInputComponent } from '../shared/ta-input/ta-input.component';
import { ProfileImagesComponent } from '../shared/profile-images/profile-images.component';
import { TaCustomCardComponent } from '../shared/ta-custom-card/ta-custom-card.component';

@NgModule({
    declarations: [
        AccountingIndexComponent,
        PayrollComponent,
        AccountingPayrollComponent,
        PayrollTableComponent,
        PayrollTablePipe,
        PayrollReportComponent,
        PayrollSmallTablesComponent
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
        TaCustomCardComponent
    ],
    exports: [AccountingIndexComponent, PayrollTableComponent]
})
export class AccountingModule {}
