import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { DriverTableComponent } from '@pages/driver/pages/driver-table/driver-table.component';

// resolvers
import { DriverMinimalResolver } from '@pages/driver/resolvers/driver-minimal-list.resolver';
import { DriverDetailsResolver } from '@pages/driver/resolvers/driver-details.resolver';

const routes: Routes = [
    {
        path: '',
        component: DriverTableComponent,
        data: { title: 'Driver' },
    },
    {
        path: ':id/details',
        loadComponent: () =>
            import(
                '@pages/driver/pages/driver-details/driver-details.component'
            ).then((m) => m.DriverDetailsComponent),
        resolve: {
            driver: DriverDetailsResolver,
            driverMinimal: DriverMinimalResolver,
        },
        data: { title: 'Driver Details' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {}
