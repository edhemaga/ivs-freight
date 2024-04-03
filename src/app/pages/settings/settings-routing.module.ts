import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// resolvers
import { CompanySettingsResolver } from './resolvers/company-settings.resolver';
import { CompanyParkingResolver } from './resolvers/company-parking.resolver';
import { CompanyOfficeResolver } from './resolvers/company-office.resolver';
import { CompanyTerminalResolver } from './resolvers/company-terminal.resolver';
import { CompanyRepairShopResolver } from './resolvers/company-repairshop.resolver';
import { UserResolver } from '../user/resolvers/user.resolver';
import { CompanyIntegrationsResolver } from './resolvers/company-integrations.resolver';

// components
import { UnderConstructionComponent } from '../../core/components/under-construction/under-construction.component';
import { SettingsComponent } from './pages/settings/settings.component';

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
                        './pages/settings-company/settings-company.module'
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
                        './pages/settings-location/settings-location.module'
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
                    import('../user/user.module').then((m) => m.UserModule),
                data: { title: 'User' },
                resolve: {
                    user: UserResolver,
                },
            },
            {
                path: 'document',
                loadChildren: () =>
                    import(
                        './pages/settings-document/settings-document.module'
                    ).then((m) => m.SettingsDocumentModule),
                data: { title: 'Document' },
            },
            {
                path: 'billing',
                // loadChildren: () =>
                //     import('./settings-billing/settings-billing.module').then(
                //         (m) => m.SettingsBillingModule
                //     ),
                component: UnderConstructionComponent,
                data: { title: 'Billing' },
            },
            {
                path: 'custom-agreement',
                // loadChildren: () =>
                //     import('./custom-agreement/custom-agreement.module').then(
                //         (m) => m.CustomAgreementModule
                //     ),
                component: UnderConstructionComponent,
                data: { title: 'Custom Agreement' },
            },
            {
                path: 'training-material',
                // loadChildren: () =>
                //     import('./training-material/training-material.module').then(
                //         (m) => m.TrainingMaterialModule
                //     ),
                component: UnderConstructionComponent,
                data: { title: 'Training Material' },
            },
            {
                path: 'integration',
                loadChildren: () =>
                    import(
                        './pages/settings-integration/settings-integration.module'
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
