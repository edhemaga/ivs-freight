import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { TruckMinimalResolver } from '@pages/truck/resolvers/truck-details-minimal.resolver';
import { TruckItemsResolver } from '@pages/truck/resolvers/truck-items.resolver';

// components
import { TruckCardComponent } from '@pages/truck/pages/truck-card/truck-card.component';
import { TruckTableComponent } from '@pages/truck/pages/truck-table/truck-table.component';

const routes: Routes = [
    {
        path: '',
        component: TruckTableComponent,
        data: { title: 'Truck' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import(
                '@pages/truck/pages/truck-details/truck-details.module'
            ).then((m) => m.TruckDetailsModule),
        resolve: {
            truck: TruckItemsResolver,
            truckMinimal: TruckMinimalResolver,
        },
        data: { title: 'Truck detail' },
    },
    {
        path: 'card',
        component: TruckCardComponent,
        data: { title: 'Truck cards' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TruckRoutingModule {}
