import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';

// guards
import { AuthGuard } from '@core/guards/authentication.guard';
import { CompanySettingsGuard } from '@core/guards/company-settings.guard';

// resolvers
import { TrailerActiveResolver } from '@pages/trailer/resolvers/trailer-active.resolver';
import { TruckActiveResolver } from '@pages/truck/resolvers/truck-active.resolver';
import { BrokerResolver, ShipperResolver } from '@pages/customer/resolvers';
import { DriverResolver } from '@pages/driver/resolvers/driver.resolver';
import {
    RepairTruckResolver,
    RepairShopResolver,
} from '@pages/repair/resolvers';
import { PmTrailerResolver } from '@pages/pm-truck-trailer/resolvers/pm-trailer.resolver';
import { PmTruckResolver } from '@pages/pm-truck-trailer/resolvers/pm-truck.resolver';
import { FuelResolver } from '@pages/fuel/resolvers';
import { OwnerActiveResolver } from '@pages/owner/resolvers/owner-active.resolver';
import { OwnerInactiveResolver } from '@pages/owner/resolvers/owner-inactive.resolver';
import { AccountResolver } from '@pages/account/resolvers/account.resolver';
import { ContactsResolver } from '@pages/contacts/resolvers/contacts.resolver';
import { LoadResolver } from '@pages/load/resolvers/load.resolver';
import { AccountResolver as NewAccountResolver } from '@pages/new-account/resolvers/account.resolver';

// Enums
import { eLoadRouting } from '@pages/new-load/enums';

export class ListRoutes {
    static routes = [
        {
            path: 'list/load',
            loadChildren: () =>
                import('@pages/load/load.module').then((m) => m.LoadModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { data: LoadResolver },
        },
        {
            path: eLoadRouting.LIST,
            loadChildren: () =>
                import('@pages/new-load/new-load.module').then(
                    (m) => m.NewLoadModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { data: LoadResolver },
        },
        {
            path: 'list/customer',
            loadChildren: () =>
                import('@pages/customer/customer.module').then(
                    (m) => m.CustomerModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { broker: BrokerResolver, shipper: ShipperResolver },
        },
        {
            path: 'list/driver',
            loadChildren: () =>
                import('@pages/driver/driver.module').then(
                    (m) => m.DriverModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                driver: DriverResolver,
            },
        },
        {
            path: 'list/truck',
            loadChildren: () =>
                import('@pages/truck/truck.module').then((m) => m.TruckModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                truckActive: TruckActiveResolver,
            },
        },
        {
            path: 'list/trailer',
            loadChildren: () =>
                import('@pages/trailer/trailer.module').then(
                    (m) => m.TrailerModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                trailerActive: TrailerActiveResolver,
            },
        },
        {
            path: 'list/repair',
            loadChildren: () =>
                import('@pages/repair/repair.module').then(
                    (m) => m.RepairModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                repairTruck: RepairTruckResolver,
                repairShop: RepairShopResolver,
            },
        },
        {
            path: 'list/pm',
            loadChildren: () =>
                import('@pages/pm-truck-trailer/pm-truck-trailer.module').then(
                    (m) => m.PmTruckTrailerModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                pmTrailer: PmTrailerResolver,
                pmTruck: PmTruckResolver,
            },
        },
        {
            path: 'list/fuel',
            loadChildren: () =>
                import('@pages/fuel/fuel.module').then((m) => m.FuelModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                fuel: FuelResolver,
            },
        },
        {
            path: 'list/owner',
            loadChildren: () =>
                import('@pages/owner/owner.module').then((m) => m.OwnerModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                ownerActive: OwnerActiveResolver,
                ownerInactive: OwnerInactiveResolver,
            },
        },
        {
            path: 'list/rentor',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Rentor' },
        },
        {
            path: 'list/account',
            loadChildren: () =>
                import('@pages/account/account.module').then(
                    (m) => m.AccountModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                account: AccountResolver,
            },
        },
        {
            path: 'list/new-account',
            loadComponent: () =>
                import('@pages/new-account/new-account.component').then(
                    (c) => c.NewAccountComponent
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                accountsResolved: NewAccountResolver,
            },
            data: { title: 'Account' },
        },
        {
            path: 'list/contact',
            loadChildren: () =>
                import('@pages/contacts/contacts.module').then(
                    (m) => m.ContactsModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                contact: ContactsResolver,
            },
        },
    ];
}
