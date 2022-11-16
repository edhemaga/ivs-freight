import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountTableComponent } from './account-table/account-table.component';

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
