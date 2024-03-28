import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';
import { OwnerInfoRoutingModule } from './owner-info-routing.module';
import { ApplicantModule } from '../../applicant.module';

import { OwnerInfoComponent } from './owner-info.component';

import { InputAddressDropdownComponent } from '../../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaTabSwitchComponent } from '../../../standalone-components/ta-tab-switch/ta-tab-switch.component';

@NgModule({
    declarations: [OwnerInfoComponent],
    imports: [
        /* MODULES */

        CommonModule,
        SharedModule,
        OwnerInfoRoutingModule,
        ApplicantModule,

        /* COMPONENTS */

        InputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputComponent,
        TaInputDropdownComponent,
        TaTabSwitchComponent,
    ],
})
export class OwnerInfoModule {}
