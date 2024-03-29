import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { BrokerCardComponent } from './pages/broker-card/broker-card.component';
import { CustomerTableComponent } from './pages/customer-table/customer-table.component';

// Resolvers
import { ShipperSingleResolver } from './resolvers/shipper-single.resolver';
import { BrokerDetailsResolver } from './resolvers/broker-details.resolver';
import { BrokerMinimalListResolver } from './resolvers/broker-minimal.resolver';
import { ShipperMinimalListResolver } from './resolvers/shipper-minimal.resolver';

const routes: Routes = [
    {
        path: '',
        component: CustomerTableComponent,
        data: { title: 'Customer' },
    },
    {
        path: ':id/shipper-details',
        loadChildren: () =>
            import('./pages/shipper-details/shipper-details.module').then(
                (m) => m.ShipperDetailsModule
            ),
        resolve: {
            shipper: ShipperSingleResolver,
            shipperMinimalList: ShipperMinimalListResolver,
        },
        data: { title: 'Shipper detail' },
    },
    {
        path: ':id/broker-details',
        loadChildren: () =>
            import('./pages/broker-details/broker-details.module').then(
                (m) => m.BrokerDetailsModule
            ),
        resolve: {
            broker: BrokerDetailsResolver,
            brokerMinimal: BrokerMinimalListResolver,
        },
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
