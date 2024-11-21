import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// components
import { CustomerTableComponent } from '@pages/customer/pages/customer-table/customer-table.component';

// resolvers
import {
    BrokerDetailsResolver,
    ShipperItemResolver,
    BrokerMinimalListResolver,
    ShipperMinimalListResolver,
} from '@pages/customer/resolvers';

const routes: Routes = [
    {
        path: '',
        component: CustomerTableComponent,
        data: { title: 'Customer' },
    },
    {
        path: ':id/shipper-details',
        loadChildren: () =>
            import(
                '@pages/customer/pages/shipper-details/shipper-details.module'
            ).then((m) => m.ShipperDetailsModule),
        resolve: {
            shipper: ShipperItemResolver,
            shipperMinimalList: ShipperMinimalListResolver,
        },
        data: { title: 'Shipper detail' },
    },
    {
        path: ':id/broker-details',
        loadChildren: () =>
            import(
                '@pages/customer/pages/broker-details/broker-details.module'
            ).then((m) => m.BrokerDetailsModule),
        resolve: {
            broker: BrokerDetailsResolver,
            brokerMinimal: BrokerMinimalListResolver,
        },
        data: { title: 'Broker detail' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule {}
