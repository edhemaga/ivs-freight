import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { DriverCardComponent } from '@pages/driver/pages/driver-card/driver-card.component';
import { DriverTableComponent } from '@pages/driver/pages/driver-table/driver-table.component';

// resolvers
import { DriverMinimalResolver } from '@pages/driver/resolvers/driver-minimal-list.resolver';
import { DriverItemsResolver } from '@pages/driver/resolvers/driver-items.resolver';

const routes: Routes = [
    {
        path: '',
        component: DriverTableComponent,
        data: { title: 'Driver' },
    },
    {
        path: ':id/details',
        loadChildren: () =>
            import(
                '@pages/driver/pages/driver-details/driver-details.module'
            ).then((m) => m.DriverDetailsModule),
        resolve: {
            driver: DriverItemsResolver,
            driverMinimal: DriverMinimalResolver,
        },
        data: { title: 'Driver Detail' },
    },
    {
        path: 'card',
        component: DriverCardComponent,
        data: { title: 'Driver Cards' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {}
