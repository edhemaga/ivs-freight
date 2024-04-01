import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { ApplicantOwnerInfoRoutingModule } from './applicant-owner-info-routing.module';
import { ApplicantModule } from '../../applicant.module';

// components
import { ApplicantOwnerInfoComponent } from './applicant-owner-info.component';

import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaTabSwitchComponent } from 'src/app/core/components/standalone-components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [ApplicantOwnerInfoComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantOwnerInfoRoutingModule,
        ApplicantModule,

        // components
        InputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaTabSwitchComponent,
    ],
})
export class ApplicantOwnerInfoModule {}
