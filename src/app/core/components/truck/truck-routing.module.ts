import { TruckMinimalResolver } from './state/truck-details-minima-list-state/truck-details-minimal.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckItemResolver } from './state/truck-details-state/truck.items.resolver';
import { TruckCardComponent } from './truck-card/truck-card.component';
import { TruckTableComponent } from './truck-table/truck-table.component';

const routes: Routes = [
    {
        path: '',
        component: TruckTableComponent,
        data: { title: 'Truck' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import('./truck-details/truck-details.module').then(
                (m) => m.TruckDetailsModule
            ),
        resolve: {
            truck: TruckItemResolver,
            truckMinimal: TruckMinimalResolver,
        },
        data: { title: 'Truck details' },
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
