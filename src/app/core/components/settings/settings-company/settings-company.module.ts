import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared/shared/shared.module';
import { SettingsCompanyRoutes } from './settings-company.routing';

// Components
import { SettingsCompanyComponent } from './settings-company.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsPayrollComponent } from './settings-payroll/settings-payroll.component';
import { SettingsInsurancepolicyComponent } from './settings-insurancepolicy/settings-insurancepolicy.component';
import { SettingsFactoringComponent } from './settings-factoring/settings-factoring.component';

// Modals
import { SettingsBasicModalComponent } from './company-modals/settings-basic-modal/settings-basic-modal.component';
import { SettingsInsurancePolicyModalComponent } from './company-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsFactoringModalComponent } from './company-modals/settings-factoring-modal/settings-factoring-modal.component';
import { SettingsNodataComponent } from './settings-nodata/settings-nodata.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsCardModule } from '../settings-card/settings-card.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SettingsCompanyRoutes,
    SharedModule,
    SettingsCardModule
  ],
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
