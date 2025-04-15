import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';
import { MilesComponent } from '@pages/miles/miles.component';
import { MilesCardComponent } from '@pages/miles/pages/miles-card/miles-card.component';
import { MilesTableComponent } from '@pages/miles/pages/miles-table/miles-table.component';
import { MilesMapComponent } from '@pages/miles/pages/miles-map/miles-map.component';

// guards
import { CompanySettingsGuard } from '@core/guards/company-settings.guard';
import { AuthGuard } from '@core/guards/authentication.guard';

// enums
import { eMilesRouting } from '@pages/miles/enums';

// resolvers
import { DashboardResolver } from '@pages/dashboard/resolvers/dashboard.resolver';
import { DispatcherResolver } from '@pages/dispatch/resolvers/dispatcher.resolver';
import { RoadsideActiveResolver } from '@pages/safety/violation/resolvers/roadside-active.resolver';
import { RoadsideInactiveResolver } from '@pages/safety/violation/resolvers/roadside-inactive.resolver';
import { AccidentActiveResolver } from '@pages/safety/accident/resolvers/accident-active.resolver';
import { AccidentInactiveResolver } from '@pages/safety/accident/resolvers/accident-inactive.resolver';
import { AccidentNonReportedResolver } from '@pages/safety/accident/resolvers/accident-non-reported.resolver';
import { MilesResolver } from '@pages/miles/resolvers/miles.resolver';
import { TodoResolver } from '@pages/to-do/resolvers/to-do.resolver';
import { RoutingStateResolver } from '@pages/routing/resolvers/routing-state.resolver';
import { TelematicResolver } from '@pages/telematic/resolvers/telematic-state.resolver';
import { MilesDetailsResolver } from '@pages/miles/resolvers/miles-details.resolver';
import { MilesCardsResolver } from '@pages/miles/resolvers/miles-card.resolver';
import { MilesListResolver } from '@pages/miles/resolvers/miles-list.resolver';

export class PageRoutes {
    static routes = [
        {
            path: 'dashboard',
            loadChildren: () =>
                import('@pages/dashboard/dashboard.module').then(
                    (m) => m.DashboardModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { dashboard: DashboardResolver },
        },
        {
            path: 'dispatcher',
            loadChildren: () =>
                import('@pages/dispatch/dispatch.module').then(
                    (m) => m.DispatchModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { dispatcher: DispatcherResolver },
        },
        {
            path: 'accounting',
            loadChildren: () =>
                import('@pages/accounting/accounting.module').then(
                    (m) => m.AccountingModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
        },
        {
            path: 'safety/violation',
            loadChildren: () =>
                import('@pages/safety/violation/violation.module').then(
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
                import('@pages/safety/accident/accident.module').then(
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
            path: eMilesRouting.BASE,
            component: MilesComponent,
            canActivate: [AuthGuard, CompanySettingsGuard],
            resolve: { miles: MilesResolver },
            data: { title: 'Miles' },
            children: [
                {
                    path: '',
                    component: MilesTableComponent,
                    resolve: { miles: MilesListResolver },
                },
                {
                    path: eMilesRouting.CARD,
                    component: MilesCardComponent,
                    resolve: { miles: MilesCardsResolver },
                },
                {
                    path: eMilesRouting.LIST,
                    component: MilesTableComponent,
                    resolve: { miles: MilesListResolver },
                },
                {
                    path: `${eMilesRouting.MAP}/:id`,
                    component: MilesMapComponent,
                    resolve: { miles: MilesDetailsResolver },
                },
            ],
        },
        {
            path: 'tools/calendar',
            loadChildren: () =>
                import('@pages/calendar/calendar.module').then(
                    (m) => m.CalendarModule
                ),
            canActivate: [AuthGuard, CompanySettingsGuard],
        },
        {
            path: 'tools/todo',
            loadChildren: () =>
                import('@pages/to-do/to-do.module').then((m) => m.ToDoModule),
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
                import('@pages/routing/routing.module').then(
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
            loadChildren: () =>
                import('@pages/chat/chat.module').then((m) => m.ChatModule),
            canActivate: [AuthGuard, CompanySettingsGuard],
            data: { title: 'Chat' },
        },
        {
            path: 'telematic',
            loadChildren: () =>
                import('@pages/telematic/telematic.module').then(
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
                import('@pages/settings/settings.module').then(
                    (m) => m.SettingsModule
                ),
            canActivate: [AuthGuard],
        },
        {
            path: 'catalog',
            loadChildren: () =>
                import('@pages/catalog/catalog.module').then(
                    (m) => m.CatalogModule
                ),
            canActivate: [AuthGuard],
        },
    ];
}
