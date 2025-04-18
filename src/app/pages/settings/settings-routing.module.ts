import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { CompanySettingsResolver } from '@pages/settings/resolvers/company-settings.resolver';
import { CompanyParkingResolver } from '@pages/settings/resolvers/company-parking.resolver';
import { CompanyOfficeResolver } from '@pages/settings/resolvers/company-office.resolver';
import { CompanyTerminalResolver } from '@pages/settings/resolvers/company-terminal.resolver';
import { CompanyRepairShopResolver } from '@pages/settings/resolvers/company-repairshop.resolver';
import { UserResolver } from '@pages/user/resolvers/user.resolver';
import { UserResolver as NewUserResolver } from '@pages/new-user/resolvers/user.resolver';

import { CompanyIntegrationsResolver } from '@pages/settings/resolvers/company-integrations.resolver';

// components
import { TaUnderConstructionComponent } from '@shared/components/ta-under-construction/ta-under-construction.component';
import { SettingsComponent } from '@pages/settings/pages/settings/settings.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'company', pathMatch: 'full' },
            {
                path: 'settings',
                loadChildren: () =>
                    import(
                        '@pages/settings/pages/settings-company/settings-company.module'
                    ).then((m) => m.SettingsCompanyModule),
                resolve: {
                    company: CompanySettingsResolver,
                    parking: CompanyParkingResolver,
                    office: CompanyOfficeResolver,
                    terminal: CompanyTerminalResolver,
                    companyrepairshop: CompanyIntegrationsResolver,
                },
                data: { title: 'Company' },
            },
            {
                path: 'location',
                loadChildren: () =>
                    import(
                        '@pages/settings/pages/settings-location/settings-location.module'
                    ).then((m) => m.SettingsLocationModule),
                resolve: {
                    parking: CompanyParkingResolver,
                    office: CompanyOfficeResolver,
                    terminal: CompanyTerminalResolver,
                    companyrepairshop: CompanyRepairShopResolver,
                },
                data: { title: 'Location' },
            },
            {
                path: 'user',
                loadChildren: () =>
                    import('@pages/user/user.module').then((m) => m.UserModule),
                data: { title: 'User' },
                resolve: {
                    user: UserResolver,
                },
            },
            {
                path: 'new-user',
                loadComponent: () =>
                    import('@pages/new-user/pages/user/user.component').then(
                        (c) => c.UserComponent
                    ),
                data: { title: 'User' },
                resolve: {
                    user: NewUserResolver,
                },
            },
            {
                path: 'document',
                loadChildren: () =>
                    import(
                        '@pages/settings/pages/settings-document/settings-document.module'
                    ).then((m) => m.SettingsDocumentModule),
                data: { title: 'Document' },
            },
            {
                path: 'billing',
                component: TaUnderConstructionComponent,
                data: { title: 'Billing' },
            },
            {
                path: 'custom-agreement',
                component: TaUnderConstructionComponent,
                data: { title: 'Custom Agreement' },
            },
            {
                path: 'training-material',
                component: TaUnderConstructionComponent,
                data: { title: 'Training Material' },
            },
            {
                path: 'integration',
                loadChildren: () =>
                    import(
                        '@pages/settings/pages/settings-integration/settings-integration.module'
                    ).then((m) => m.SettingsIntegrationModule),
                data: { title: 'Integration' },
                resolve: { CompanyIntegrationsResolver },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
