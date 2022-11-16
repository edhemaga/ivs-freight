import { PayrollComponent } from './payroll/payroll/payroll.component';
import { AccountingPayrollComponent } from './accounting-payroll/accounting-payroll.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AccountingPayrollComponent,
        children: [
            { path: '', redirectTo: 'payroll', pathMatch: 'full' },
            {
                path: 'payroll',
                component: PayrollComponent,
                data: { title: 'Payroll' },
            },
        ],
        data: { title: 'Accounting' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountingRoutingModule {}
