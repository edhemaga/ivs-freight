import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingIndexComponent } from './accounting-index/accounting-index.component';
import { PayrollComponent } from './payroll/payroll/payroll.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';
import { PayrollTableComponent } from './payroll/payroll/payroll-table/payroll-table.component';
import { PayrollTablePipe } from './payroll/payroll/pipe/payroll-table.pipe';
import { PayrollReportComponent } from './payroll/payroll/payroll-report/payroll-report.component';
import { PayrollSmallTablesComponent } from './payroll/payroll/payroll-small-tables/payroll-small-tables.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

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
        TruckassistTableModule,
        AngularSvgIconModule
    ],
    exports: [AccountingIndexComponent, PayrollTableComponent]
})
export class AccountingModule {}
