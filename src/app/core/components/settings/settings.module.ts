import { SettingsCardComponent } from './settings-card/settings-card.component';
import { SettingsFactoringModalComponent } from './settings-modals/settings-factoring-modal/settings-factoring-modal.component';
import { SettingsGeneralComponent } from './settings-general/settings-general.component';
import { SettingsInsurancepolicyComponent } from './settings-insurancepolicy/settings-insurancepolicy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsPayrollComponent } from './settings-payroll/settings-payroll.component';
import { SettingsFactoringComponent } from './settings-factoring/settings-factoring.component';
import { SharedModule } from '../../shared/shared/shared.module';
import { SettingsNodataComponent } from './settings-nodata/settings-nodata.component';
import { SettingsInsurancePolicyModalComponent } from './settings-modals/settings-insurance-policy-modal/settings-insurance-policy-modal.component';
import { SettingsBasicModalComponent } from './settings-modals/settings-basic-modal/settings-basic-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SettingsComponent,
    SettingsPayrollComponent,
    SettingsInsurancepolicyComponent,
    SettingsGeneralComponent,
    SettingsFactoringComponent,
    SettingsNodataComponent,
    SettingsCardComponent,

    // Modals
    SettingsBasicModalComponent,
    SettingsInsurancePolicyModalComponent,
    SettingsFactoringModalComponent,
  ],
})
export class SettingsModule {}
