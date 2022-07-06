import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairCardComponent } from './repair-card/repair-card.component';
import { RepairTableComponent } from './repair-table/repair-table.component';
import { ShopRepairItemResolver } from './state/shop-details-state/shop-item.resolver';


const routes: Routes = [
  {
    path: '',
    component: RepairTableComponent,
    data: { title: 'Repair' },
  },
  {
    path: ':id/shop-details',
    loadChildren: () =>
      import('./shop-repair-details/shop-repair-details.module').then(
        (m) => m.ShopRepairDetailsModule
      ),
    resolve: {
      shop: ShopRepairItemResolver,
    },
    data: { title: 'Shop Repair Details' },
  },
  {
    path: 'card',
    component: RepairCardComponent,
    data: { title: 'Repear cards' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairRoutingModule {}
