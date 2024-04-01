import { TruckMinimalResolver } from './resolvers/truck-details-minimal.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TruckItemResolver } from './resolvers/truck.items.resolver';
import { TruckCardComponent } from './components/truck-card/truck-card.component';
import { TruckTableComponent } from './pages/truck-table/truck-table.component';

const routes: Routes = [
    {
        path: '',
        component: TruckTableComponent,
        data: { title: 'Truck' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import('./modules/truck-details.module').then(
                (m) => m.TruckDetailsModule
            ),
        resolve: {
            truck: TruckItemResolver,
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
