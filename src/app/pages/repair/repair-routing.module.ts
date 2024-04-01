import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepairCardComponent } from './pages/repair-card/repair-card.component';
import { RepairTableComponent } from './pages/repair-table/repair-table.component';
import { RepairDResolver } from './resolvers/repair-d.resolver';

const routes: Routes = [
    {
        path: '',
        component: RepairTableComponent,
        data: { title: 'Repair' },
    },
    {
        path: ':id/shop-details',
        loadChildren: () =>
            import(
                './pages/shop-repair-details/shop-repair-details.module'
            ).then((m) => m.ShopRepairDetailsModule),
        resolve: { repairShopResolve: RepairDResolver },
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
