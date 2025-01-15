import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { SettingsCompanyRoutingModule } from '@pages/settings/pages/settings-company/settings-company-routing.module';
import { SharedModule } from '@shared/shared.module';

// Components
import { SettingsCompanyComponent } from '@pages/settings/pages/settings-company/settings-company.component';
import { SettingsGeneralComponent } from '@pages/settings/pages/settings-company/components/settings-general/settings-general.component';
import { SettingsPayrollComponent } from '@pages/settings/pages/settings-company/components/settings-payroll/settings-payroll.component';
import { SettingsInsurancepolicyComponent } from '@pages/settings/pages/settings-company/components/settings-insurancepolicy/settings-insurancepolicy.component';
import { SettingsFactoringComponent } from '@pages/settings/pages/settings-company/components/settings-factoring/settings-factoring.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '@shared/components/ta-copy/ta-copy.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaNoticeOfAsignmentComponent } from '@shared/components/ta-notice-of-asignment/ta-notice-of-asignment.component';
import { TaLogoChangeComponent } from '@shared/components/ta-logo-change/ta-logo-change.component';
import { TaCommonCardComponent } from '@shared/components/ta-common-card/ta-common-card.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { TaProgressExpirationComponent } from '@shared/components/ta-progress-expiration/ta-progress-expiration.component';

// Pipes
import { DetailsActiveItemPipe } from '@shared/pipes/details-active-item.pipe';
import { FormatEinPipe } from '@shared/pipes/format-ein.pipe';
import { ThousandSeparatorPipe } from '@shared/pipes/thousand-separator.pipe';
import { FormatDatePipe } from '@shared/pipes/format-date.pipe';
import { HidePasswordPipe } from '@shared/pipes/hide-password.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { BankCardTypesPipe } from '@shared/pipes/bank-card-types.pipe';
import { TaSvgPipe } from '@shared/pipes/ta-svg.pipe';
import { SettingsCompanyAdditionalInfoHasDataPipe } from './pipes';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        SettingsCompanyRoutingModule,
        TaAppTooltipV2Component,
        TaCustomCardComponent,
        TaCopyComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
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
        TaCommonCardComponent,
        TaLogoChangeComponent,
        TaCounterComponent,
        TaProgressExpirationComponent,

        // PIPES
        HidePasswordPipe,
        SafeHtmlPipe,
        BankCardTypesPipe,
        TaSvgPipe,
        SettingsCompanyAdditionalInfoHasDataPipe
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
