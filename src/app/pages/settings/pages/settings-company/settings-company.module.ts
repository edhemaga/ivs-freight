import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SettingsCompanyRoutes } from './settings-company.routing';
import { SharedModule } from 'src/app/core/components/shared/shared.module';

// Components
import { SettingsCompanyComponent } from './settings-company.component';
import { SettingsGeneralComponent } from './components/settings-general/settings-general.component';
import { SettingsPayrollComponent } from './components/settings-payroll/settings-payroll.component';
import { SettingsInsurancepolicyComponent } from './components/settings-insurancepolicy/settings-insurancepolicy.component';
import { SettingsFactoringComponent } from './components/settings-factoring/settings-factoring.component';
import { AppTooltipComponent } from 'src/app/core/components/standalone-components/app-tooltip/app-tooltip.component';
import { TaCustomCardComponent } from 'src/app/core/components/shared/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from 'src/app/core/components/shared/ta-copy/ta-copy.component';
import { TaModalComponent } from 'src/app/core/components/shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxCardComponent } from 'src/app/core/components/shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from 'src/app/core/components/shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from 'src/app/core/components/shared/ta-input-note/ta-input-note.component';
import { TaNoticeOfAsignmentComponent } from 'src/app/core/components/shared/ta-notice-of-asignment/ta-notice-of-asignment.component';
import { TaLogoChangeComponent } from 'src/app/core/components/shared/ta-logo-change/ta-logo-change.component';
import { TaReCardComponent } from 'src/app/core/components/shared/ta-common-card/ta-re-card.component';
import { TaCounterComponent } from 'src/app/core/components/shared/ta-counter/ta-counter.component';
import { TruckassistProgressExpirationComponent } from 'src/app/core/components/shared/truckassist-progress-expiration/truckassist-progress-expiration.component';

// Pipes
import { DetailsActiveItemPipe } from 'src/app/shared/pipes/details-active-item.pipe';
import { FormatEinPipe } from 'src/app/shared/pipes/format-ein.pipe';
import { ThousandSeparatorPipe } from 'src/app/shared/pipes/thousand-separator.pipe';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { HidePasswordPipe } from 'src/app/shared/pipes/hide-password.pipe';
import { SafeHtmlPipe } from 'src/app/shared/pipes/safe-html.pipe';
import { BankCardTypesPipe } from 'src/app/shared/pipes/bank-card-types.pipe';
import { TaSvgPipe } from 'src/app/shared/pipes/ta-svg.pipe';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SettingsCompanyRoutes,
        SharedModule,
        AppTooltipComponent,
        TaCustomCardComponent,
        TaCopyComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        TaCheckboxCardComponent,
        TaInputDropdownComponent,
        TaCheckboxComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaNoticeOfAsignmentComponent,
        DetailsActiveItemPipe,
        FormatEinPipe,
        ThousandSeparatorPipe,
        FormatDatePipe,
        TaReCardComponent,
        TaLogoChangeComponent,
        TaCounterComponent,
        TruckassistProgressExpirationComponent,

        // PIPES
        HidePasswordPipe,
        SafeHtmlPipe,
        BankCardTypesPipe,
        TaSvgPipe,
    ],
    exports: [SharedModule],
    declarations: [
        SettingsCompanyComponent,
        SettingsGeneralComponent,
        SettingsPayrollComponent,
        SettingsInsurancepolicyComponent,
        SettingsFactoringComponent,
    ],
})
export class SettingsCompanyModule {}
