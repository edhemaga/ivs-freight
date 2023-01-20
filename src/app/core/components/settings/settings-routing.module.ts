import { SettingsComponent } from './settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { companySettingsResolver } from './state/company-state/company-settings.resolver';
import { ParkingResolver } from './settings-location/settings-parking/parking-state/company-parking.resolver';
import { cOfficeResolver } from './settings-location/settings-office/state/company-office.resolver';
import { TerminalResolver } from './settings-location/settings-terminal/state/company-terminal.resolver';
import { companyRepairShopResolver } from './settings-location/settings-repair-shop/state/company-repairshop.resolver';
import { UserResolver } from '../user/state/user-state/user.resolver';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'company', pathMatch: 'full' },
            {
                path: 'company',
                loadChildren: () =>
                    import('./settings-company/settings-company.module').then(
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
                    import('./settings-location/settings-location.module').then(
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
                    import('../../../core/components/user/user.module').then(
                        (m) => m.UserModule
                    ),
                data: { title: 'User' },
                resolve: {
                    user: UserResolver,
                },
            },
            {
                path: 'document',
                loadChildren: () =>
                    import('./settings-document/settings-document.module').then(
                        (m) => m.SettingsDocumentModule
                    ),
                data: { title: 'Document' },
            },
            {
                path: 'billing',
                loadChildren: () =>
                    import('./settings-billing/settings-billing.module').then(
                        (m) => m.SettingsBillingModule
                    ),
                data: { title: 'Billing' },
            },
            {
                path: 'custom-agreement',
                loadChildren: () =>
                    import('./custom-agreement/custom-agreement.module').then(
                        (m) => m.CustomAgreementModule
                    ),
                data: { title: 'Custom Agreement' },
            },
            {
                path: 'training-material',
                loadChildren: () =>
                    import('./training-material/training-material.module').then(
                        (m) => m.TrainingMaterialModule
                    ),
                data: { title: 'Training Material' },
            },
            {
                path: 'integration',
                loadChildren: () =>
                    import(
                        './settings-integration/settings-integration.module'
                    ).then((m) => m.SettingsIntegrationModule),
                data: { title: 'Integration' },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
