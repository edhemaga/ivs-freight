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
import { SharedModule } from '../../shared/shared.module';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaCopyComponent } from '../../shared/ta-copy/ta-copy.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxCardComponent } from '../../shared/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCheckboxComponent } from '../../shared/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { TaNoticeOfAsignmentComponent } from '../../shared/ta-notice-of-asignment/ta-notice-of-asignment.component';
import { DetailsActiveItemPipe } from 'src/app/core/pipes/detailsActiveItem.pipe';
import { formatEinPipe } from 'src/app/core/pipes/formatEin.pipe';
import { TaThousandSeparatorPipe } from 'src/app/core/pipes/taThousandSeparator.pipe';
import { formatDatePipe } from 'src/app/core/pipes/formatDate.pipe';

import { TaReCardComponent } from '../../shared/ta-common-card/ta-re-card.component';

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
        formatEinPipe,
        TaThousandSeparatorPipe,
        formatDatePipe,
        TaReCardComponent
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
