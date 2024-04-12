import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantOwnerInfoRoutingModule } from './applicant-owner-info-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { ApplicantOwnerInfoComponent } from './applicant-owner-info.component';

import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [ApplicantOwnerInfoComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantOwnerInfoRoutingModule,
        ApplicantModule,

        // components
        TaInputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaTabSwitchComponent,
    ],
})
export class ApplicantOwnerInfoModule {}
