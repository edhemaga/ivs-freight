import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsCompanyRoutes } from './settings-company.routing';

// Components
import { SettingsCompanyComponent } from './settings-company.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsPayrollComponent } from './settings-payroll/settings-payroll.component';
import { SettingsInsurancepolicyComponent } from './settings-insurancepolicy/settings-insurancepolicy.component';
import { SettingsFactoringComponent } from './settings-factoring/settings-factoring.component';

// Modals
import { SettingsBasicModalComponent } from '../../modals/company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from '../../modals/company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from '../../modals/company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { SettingsNodataComponent } from './settings-nodata/settings-nodata.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TruckassistProgressExpirationModule } from '../../shared/truckassist-progress-expiration/truckassist-progress-expiration.module';
import { SettingsSharedModule } from '../settings-shared/settings-shared.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SettingsCompanyRoutes,
        SharedModule,
        SettingsSharedModule,
        TruckassistProgressExpirationModule,
    ],
    exports: [SharedModule],
    declarations: [
        SettingsCompanyComponent,
        SettingsGeneralComponent,
        SettingsPayrollComponent,
        SettingsInsurancepolicyComponent,
        SettingsFactoringComponent,

        SettingsNodataComponent,
        //Modals
        SettingsBasicModalComponent,
        SettingsInsurancePolicyModalComponent,
        SettingsFactoringModalComponent,
    ],
})
export class SettingsCompanyModule {}
