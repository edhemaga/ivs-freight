import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { companySettingsResolver } from './resolvers/company-settings.resolver';
import { ParkingResolver } from './resolvers/company-parking.resolver';
import { cOfficeResolver } from './resolvers/company-office.resolver';
import { TerminalResolver } from './resolvers/company-terminal.resolver';
import { companyRepairShopResolver } from './resolvers/company-repairshop.resolver';
import { UserResolver } from '../user/state/user-state/user.resolver';
import { UnderConstructionComponent } from '../../core/components/under-construction/under-construction.component';
import { integrationResolver } from './resolvers/company-integrations.resolver';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'company', pathMatch: 'full' },
            {
                path: 'settings',
                loadChildren: () =>
                    import('./modules/settings-company.module').then(
                        (m) => m.SettingsCompanyModule
                    ),
                resolve: {
                    company: companySettingsResolver,
                    parking: ParkingResolver,
                    office: cOfficeResolver,
                    terminal: TerminalResolver,
                    companyrepairshop: companyRepairShopResolver,
                },
                data: { title: 'Company' },
            },
            {
                path: 'location',
                loadChildren: () =>
                    import('./modules/settings-location.module').then(
                        (m) => m.SettingsLocationModule
                    ),
                resolve: {
                    parking: ParkingResolver,
                    office: cOfficeResolver,
                    terminal: TerminalResolver,
                    companyrepairshop: companyRepairShopResolver,
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
                    import('./modules/settings-document.module').then(
                        (m) => m.SettingsDocumentModule
                    ),
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
                    import('./modules/settings-integration.module').then(
                        (m) => m.SettingsIntegrationModule
                    ),
                data: { title: 'Integration' },
                resolve: { integrationResolver },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
