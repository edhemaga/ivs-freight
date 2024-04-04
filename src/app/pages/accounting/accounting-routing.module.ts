import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { PayrollComponent } from './pages/payroll/payroll.component';
import { AccountingPayrollComponent } from './pages/accounting-payroll/accounting-payroll.component';

// Resolvers
import { PayrolldResolver } from './pages/payroll/state/payroll-resolver';

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
                resolve: [PayrolldResolver],
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
