import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Resolvers
import { RepairDetailsResolver } from './resolvers/repair-details.resolver';

// Components
import { RepairCardComponent } from './pages/repair-card/repair-card.component';
import { RepairTableComponent } from './pages/repair-table/repair-table.component';

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
                './pages/shop-repair-details/repair-shop-details.module'
            ).then((m) => m.RepairShopDetailsModule),
        resolve: { repairShopResolve: RepairDetailsResolver },
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
