import { TaUnderConstructionComponent } from 'src/app/shared/components/ta-under-construction/ta-under-construction.component';

// guards
import { AuthGuard } from 'src/app/core/guards/authentication.guard';
import { CompanySettingsGuard } from 'src/app/core/guards/company-settings.guard';

// resolvers
import { LoadTemplateResolver } from 'src/app/pages/load/state/load-template-state/load-template.resolver';
import { TrailerActiveResolver } from 'src/app/pages/trailer/resolvers/trailer-active.resolver';
import { TrailerInactiveResolver } from 'src/app/pages/trailer/resolvers/trailer-inactive.resolver';
import { TruckActiveResolver } from 'src/app/pages/truck/resolvers/truck-active.resolver';
import { TruckInactiveResolver } from 'src/app/pages/truck/resolvers/truck-inactive.resolver';
import { BrokerResolver } from 'src/app/pages/customer/resolvers/broker.resolver';
import { ShipperResolver } from 'src/app/pages/customer/resolvers/shipper.resolver';
import { ApplicantTableResolver } from 'src/app/pages/driver/state/applicant-state/applicant-table.resolver';
import { DriverActiveResolver } from 'src/app/pages/driver/state/driver-active-state/driver-active.resolver';
import { DriverInactiveResolver } from 'src/app/pages/driver/state/driver-inactive-state/driver-inactive.resolver';
import { LoadActiveResolver } from 'src/app/pages/load/state/load-active-state/load-active.resolver';
import { LoadClosedResolver } from 'src/app/pages/load/state/load-closed-state/load-closed.resolver';
import { LoadPandingResolver } from 'src/app/pages/load/state/load-pending-state/load-panding.resolver';
import { RepairTruckResolver } from 'src/app/pages/repair/resolvers/repair-truck.resolver';
import { RepairTrailerResolver } from 'src/app/pages/repair/resolvers/repair-trailer.resolver';
import { RepairShopResolver } from 'src/app/pages/repair/resolvers/repair-shop.resolver';
import { PmTrailerResolver } from 'src/app/pages/pm-truck-trailer/resolvers/pm-trailer.resolver';
import { PmTruckResolver } from 'src/app/pages/pm-truck-trailer/resolvers/pm-truck.resolver';
import { FuelResolver } from 'src/app/pages/fuel/state/fule-state/fuel-state.resolver';
import { OwnerActiveResolver } from 'src/app/pages/owner/state/owner-active-state/owner-active.resolver';
import { OwnerInactiveResolver } from 'src/app/pages/owner/state/owner-inactive-state/owner-inactive.resolver';
import { AccountResolver } from 'src/app/pages/account/resolvers/account.resolver';
import { ContactsResolver } from 'src/app/pages/contacts/resolvers/contacts.resolver';

export class ListRoutes {
    static routes = [
        {
            path: 'list/load',
            loadChildren: () =>
                import('src/app/pages/load/load.module').then(
                    (m) => m.LoadModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                loadTemplate: LoadTemplateResolver,
                loadPanding: LoadPandingResolver,
                loadActive: LoadActiveResolver,
                loadClosed: LoadClosedResolver,
            },
        },
        {
            path: 'list/customer',
            loadChildren: () =>
                import('src/app/pages/customer/customer.module').then(
                    (m) => m.CustomerModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { broker: BrokerResolver, shipper: ShipperResolver },
        },
        {
            path: 'list/driver',
            loadChildren: () =>
                import('src/app/pages/driver/driver.module').then(
                    (m) => m.DriverModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                driverActive: DriverActiveResolver,
                driverInactive: DriverInactiveResolver,
                applicantAdminTable: ApplicantTableResolver,
            },
        },
        {
            path: 'list/truck',
            loadChildren: () =>
                import('src/app/pages/truck/truck.module').then(
                    (m) => m.TruckModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                truckActive: TruckActiveResolver,
                truckInactive: TruckInactiveResolver,
            },
        },
        {
            path: 'list/trailer',
            loadChildren: () =>
                import('src/app/pages/trailer/trailer.module').then(
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
                import('src/app/pages/repair/repair.module').then(
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
                import(
                    'src/app/pages/pm-truck-trailer/pm-truck-trailer.module'
                ).then((m) => m.PmTruckTrailerModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                pmTrailer: PmTrailerResolver,
                pmTruck: PmTruckResolver,
            },
        },
        {
            path: 'list/fuel',
            loadChildren: () =>
                import('src/app/pages/fuel/fuel.module').then(
                    (m) => m.FuelModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                fuel: FuelResolver,
            },
        },
        {
            path: 'list/owner',
            loadChildren: () =>
                import('src/app/pages/owner/owner.module').then(
                    (m) => m.OwnerModule
                ),
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
                import('src/app/pages/account/account.module').then(
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
                import('src/app/pages/contacts/contacts.module').then(
                    (m) => m.ContactsModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                contact: ContactsResolver,
            },
        },
    ];
}
