import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';

// guards
import { AuthGuard } from '@core/guards/authentication.guard';
import { CompanySettingsGuard } from '@core/guards/company-settings.guard';

// resolvers
import { LoadTemplateResolver } from '@pages/load/resolvers/load-template.resolver';
import { TrailerActiveResolver } from '@pages/trailer/resolvers/trailer-active.resolver';
import { TrailerInactiveResolver } from '@pages/trailer/resolvers/trailer-inactive.resolver';
import { TruckActiveResolver } from '@pages/truck/resolvers/truck-active.resolver';
import { TruckInactiveResolver } from '@pages/truck/resolvers/truck-inactive.resolver';
import { BrokerResolver } from '@pages/customer/resolvers/broker.resolver';
import { ShipperResolver } from '@pages/customer/resolvers/shipper.resolver';
import { ApplicantTableResolver } from '@pages/driver/resolvers/applicant-table.resolver';
import { DriverActiveResolver } from '@pages/driver/resolvers/driver-active.resolver';
import { DriverInactiveResolver } from '@pages/driver/resolvers/driver-inactive.resolver';
import { LoadActiveResolver } from '@pages/load/resolvers/load-active.resolver';
import { LoadClosedResolver } from '@pages/load/resolvers/load-closed.resolver';
import { LoadPendingResolver } from '@pages/load/resolvers/load-pending.resolver';
import { RepairTruckResolver } from '@pages/repair/resolvers/repair-truck.resolver';
import { RepairTrailerResolver } from '@pages/repair/resolvers/repair-trailer.resolver';
import { RepairShopResolver } from '@pages/repair/resolvers/repair-shop.resolver';
import { PmTrailerResolver } from '@pages/pm-truck-trailer/resolvers/pm-trailer.resolver';
import { PmTruckResolver } from '@pages/pm-truck-trailer/resolvers/pm-truck.resolver';
import { FuelResolver } from '@pages/fuel/resolvers/fuel.resolver';
import { OwnerActiveResolver } from '@pages/owner/resolvers/owner-active.resolver';
import { OwnerInactiveResolver } from '@pages/owner/resolvers/owner-inactive.resolver';
import { AccountResolver } from '@pages/account/resolvers/account.resolver';
import { ContactsResolver } from '@pages/contacts/resolvers/contacts.resolver';

export class ListRoutes {
    static routes = [
        {
            path: 'list/load',
            loadChildren: () =>
                import('@pages/load/load.module').then((m) => m.LoadModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                loadTemplate: LoadTemplateResolver,
                loadPanding: LoadPendingResolver,
                loadActive: LoadActiveResolver,
                loadClosed: LoadClosedResolver,
            },
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
                /*     driverActive: DriverActiveResolver,
                driverInactive: DriverInactiveResolver,
                applicantAdminTable: ApplicantTableResolver, */
            },
        },
        {
            path: 'list/truck',
            loadChildren: () =>
                import('@pages/truck/truck.module').then((m) => m.TruckModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                truckActive: TruckActiveResolver,
                truckInactive: TruckInactiveResolver,
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
                trailerInactive: TrailerInactiveResolver,
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
                repairTrailer: RepairTrailerResolver,
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
