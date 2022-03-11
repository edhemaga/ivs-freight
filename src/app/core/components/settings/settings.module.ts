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


@NgModule({
  imports: [CommonModule, SettingsRoutingModule, SharedModule],
  declarations: [
    SettingsComponent,
    SettingsPayrollComponent,
    SettingsInsurancepolicyComponent,
    SettingsGeneralComponent,
    SettingsFactoringComponent,
    SettingsNodataComponent
  ],
})
export class SettingsModule {}
