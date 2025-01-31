import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { FuelTableComponent } from '@pages/fuel/pages/fuel-table/fuel-table.component';
import { FuelDetailsResolver } from '@pages/fuel/resolvers';

const routes: Routes = [
    {
        path: '',
        component: FuelTableComponent,
        data: { title: 'Fuel' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import('@pages/fuel/pages/fuel-details/fuel-details.module').then(
                (m) => m.FuelDetailsModule
            ),
        resolve: {
            fuelSingle: FuelDetailsResolver,
        },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FuelRoutingModule {}
