import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingIndexComponent } from './accounting-index/accounting-index.component';
import { PayrollComponent } from './payroll/payroll/payroll.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { TruckassistTableModule } from '../shared/truckassist-table/truckassist-table.module';

@NgModule({
  declarations: [
    AccountingIndexComponent,
    PayrollComponent,
    AccountingPayrollComponent,
  ],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    SharedModule,
    TruckassistTableModule,
  ],
  entryComponents: [AccountingIndexComponent],
  exports: [AccountingIndexComponent],
})
export class AccountingModule {}
