import { TaUnderConstructionComponent } from 'src/app/shared/components/ta-under-construction/ta-under-construction.component';

// guards
import { CompanySettingsGuard } from 'src/app/core/guards/company-settings.guard';
import { AuthGuard } from 'src/app/core/guards/authentication.guard';

// resolvers
import { DashboardResolver } from 'src/app/pages/dashboard/resolvers/dashboard.resolver';
import { DispatcherResolver } from 'src/app/pages/dispatch/resolvers/dispatcher.resolver';
import { RoadsideActiveResolver } from 'src/app/pages/safety/violation/resolvers/roadside-active.resolver';
import { RoadsideInactiveResolver } from 'src/app/pages/safety/violation/resolvers/roadside-inactive.resolver';
import { AccidentActiveResolver } from 'src/app/pages/safety/accident/resolvers/accident-active.resolver';
import { AccidentInactiveResolver } from 'src/app/pages/safety/accident/resolvers/accident-inactive.resolver';
import { AccidentNonReportedResolver } from 'src/app/pages/safety/accident/resolvers/accident-non-reported.resolver';
import { MilesResolver } from 'src/app/pages/miles/resolvers/miles.resolver';
import { TodoResolver } from 'src/app/pages/to-do/resolvers/to-do.resolver';
import { RoutingStateResolver } from 'src/app/pages/routing/resolvers/routing-state.resolver';
import { TelematicResolver } from 'src/app/pages/telematic/resolvers/telematic-state.resolver';

export class PageRoutes {
    static routes = [
        {
            path: 'dashboard',
            loadChildren: () =>
                import('src/app/pages/dashboard/dashboard.module').then(
                    (m) => m.DashboardModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { dashboard: DashboardResolver },
        },
        {
            path: 'dispatcher',
            loadChildren: () =>
                import('src/app/pages/dispatch/dispatch.module').then(
                    (m) => m.DispatchModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { dispatcher: DispatcherResolver },
        },
        {
            path: 'accounting',
            loadChildren: () =>
                import('src/app/pages/accounting/accounting.module').then(
                    (m) => m.AccountingModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
        },
        {
            path: 'safety/violation',
            loadChildren: () =>
                import('src/app/pages/safety/violation/violation.module').then(
                    (m) => m.ViolationModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                roadsideActive: RoadsideActiveResolver,
                roadsideInactive: RoadsideInactiveResolver,
            },
        },
        {
            path: 'safety/accident',
            loadChildren: () =>
                import('src/app/pages/safety/accident/accident.module').then(
                    (m) => m.AccidentModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                accidentActive: AccidentActiveResolver,
                accidentInactive: AccidentInactiveResolver,
                accidentNonReported: AccidentNonReportedResolver,
            },
        },
        {
            path: 'safety/log',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Log' },
        },
        {
            path: 'safety/scheduled-insurance',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Scheduled Insurance' },
        },
        {
            path: 'safety/mvr',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Mvr' },
        },
        {
            path: 'safety/test',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Test' },
        },
        {
            path: 'tools/miles',
            loadChildren: () =>
                import('src/app/pages/miles/miles.module').then(
                    (m) => m.MilesModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { miles: MilesResolver },
        },
        {
            path: 'tools/calendar',
            loadChildren: () =>
                import('src/app/pages/calendar/calendar.module').then(
                    (m) => m.CalendarModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
        },
        {
            path: 'tools/todo',
            loadChildren: () =>
                import('src/app/pages/to-do/to-do.module').then(
                    (m) => m.ToDoModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { todo: TodoResolver },
        },
        {
            path: 'tools/1099',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: '1099' },
        },
        {
            path: 'tools/2290',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: '2290' },
        },
        {
            path: 'tools/factoring',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Factoring' },
        },
        {
            path: 'tools/fax',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Fax' },
        },
        {
            path: 'tools/sms',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Sms' },
        },
        {
            path: 'routing',
            loadChildren: () =>
                import('src/app/pages/routing/routing.module').then(
                    (m) => m.RoutingModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                routing: RoutingStateResolver,
            },
        },
        {
            path: 'report',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Report' },
        },
        {
            path: 'statistic',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Statistic' },
        },
        {
            path: 'chat',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Chat' },
        },
        {
            path: 'telematic',
            loadChildren: () =>
                import('src/app/pages/telematic/telematic.module').then(
                    (m) => m.TelematicModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: {
                routing: TelematicResolver,
            },
        },
        {
            path: 'places',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Places' },
        },
        {
            path: 'file-manager',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'File Manager' },
        },
        {
            path: 'notifications',
            component: TaUnderConstructionComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Notifications' },
        },
        {
            path: 'company',
            loadChildren: () =>
                import('src/app/pages/settings/settings.module').then(
                    (m) => m.SettingsModule
                ),
            canActivate: [AuthGuard],
        },
        {
            path: 'catalog',
            loadChildren: () =>
                import('src/app/pages/catalog/catalog.module').then(
                    (m) => m.CatalogModule
                ),
            canActivate: [AuthGuard],
        },
    ];
}
