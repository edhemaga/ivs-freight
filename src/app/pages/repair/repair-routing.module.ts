import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import {
    RepairDetailsResolver,
    RepairMinimalResolver,
} from '@pages/repair/resolvers';

// components
import { RepairTableComponent } from '@pages/repair/pages/repair-table/repair-table.component';

const routes: Routes = [
    {
        path: '',
        component: RepairTableComponent,
        data: { title: 'Repair' },
    },
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/repair/pages/repair-shop-details/repair-shop-details.component'
            ).then((m) => m.RepairShopDetailsComponent),
        resolve: {
            repairShop: RepairDetailsResolver,
            repairShopMinimal: RepairMinimalResolver,
        },
        data: { title: 'Repair Shop Details' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RepairRoutingModule {}
