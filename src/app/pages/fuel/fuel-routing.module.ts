import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import {
    FuelDetailsResolver,
    FuelMinimalResolver,
} from '@pages/fuel/resolvers';

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
                '@pages/fuel/pages/fuel-stop-details/fuel-stop-details.component'
            ).then((m) => m.FuelStopDetailsComponent),
        resolve: {
            fuelStop: FuelDetailsResolver,
            fuelStopMinimal: FuelMinimalResolver,
        },
        data: { title: 'Fuel Stop Details' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FuelRoutingModule {}
