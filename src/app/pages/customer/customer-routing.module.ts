import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { BrokerCardComponent } from '@pages/customer/pages/broker-card/broker-card.component';
import { CustomerTableComponent } from '@pages/customer/pages/customer-table/customer-table.component';

// Resolvers
import { ShipperItemResolver } from '@pages/customer/resolvers/shipper-item.resolver';
import { BrokerDetailsResolver } from '@pages/customer/resolvers/broker-details.resolver';
import { BrokerMinimalListResolver } from '@pages/customer/resolvers/broker-minimal-list.resolver';
import { ShipperMinimalListResolver } from '@pages/customer/resolvers/shipper-minimal-list.resolver';

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
    {
        path: 'card',
        component: BrokerCardComponent,
        data: { title: 'Shipper cards' },
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule {}
