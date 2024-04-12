import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { PayrollComponent } from './pages/payroll/payroll.component';
import { AccountingPayrollComponent } from './pages/accounting-payroll/accounting-payroll.component';
import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';

// resolvers
import { PayrolldResolver } from './pages/payroll/state/payroll-resolver';

const routes: Routes = [
    {
        path: '',
        component: AccountingPayrollComponent,
        children: [
            {
                path: 'payroll',
                component: PayrollComponent,
                data: { title: 'Payroll' },
                resolve: [PayrolldResolver],
            },
            {
                path: 'ifta',
                component: TaUnderConstructionComponent,
                data: { title: 'Ifta' },
            },
            {
                path: 'ledger',
                component: TaUnderConstructionComponent,
                data: { title: 'Ledger' },
            },
            {
                path: 'tax',
                component: TaUnderConstructionComponent,
                data: { title: 'Tax' },
            },
            { path: '', redirectTo: 'payroll', pathMatch: 'full' },
        ],
        data: { title: 'Accounting' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountingRoutingModule {}
