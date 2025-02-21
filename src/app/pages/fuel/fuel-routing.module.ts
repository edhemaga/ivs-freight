import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { FuelDetailsResolver } from '@pages/fuel/resolvers';

// components
import { FuelTableComponent } from '@pages/fuel/pages/fuel-table/fuel-table.component';

const routes: Routes = [
    {
        path: '',
        component: FuelTableComponent,
        data: { title: 'Fuel' },
    },
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/fuel/pages/fuel-details/fuel-details.component'
            ).then((m) => m.FuelDetailsComponent),
        resolve: {
            fuelSingle: FuelDetailsResolver,
        },
        data: { title: 'Fuel Details' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FuelRoutingModule {}
