import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { AccountTableComponent } from '@pages/account/pages/account-table/account-table.component';

const routes: Routes = [
    {
        path: '',
        component: AccountTableComponent,
        data: { title: 'Account' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountRoutingModule {}
