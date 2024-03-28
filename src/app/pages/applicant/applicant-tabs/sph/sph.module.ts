import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SphComponent } from './sph.component';
import { SphModalComponent } from './sph-modal/sph-modal.component';

import { SharedModule } from '../../../shared/shared.module';
import { SphRoutingModule } from './sph-routing.module';
import { ApplicantModule } from './../../applicant.module';
import { TaCheckboxComponent } from '../../../shared/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputComponent } from '../../../shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaInputArrowsComponent } from '../../../shared/ta-input-arrows/ta-input-arrows.component';
import { TaInputDropdownComponent } from '../../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '../../../shared/ta-modal/ta-modal.component';

@NgModule({
    declarations: [SphComponent, SphModalComponent],
    imports: [
            CommonModule, 
            SharedModule, 
            SphRoutingModule, 
            ApplicantModule,
            TaCheckboxComponent,
            TaInputRadiobuttonsComponent,
            TaInputComponent,
            InputAddressDropdownComponent,
            TaInputArrowsComponent,
            TaInputDropdownComponent,
            TaModalComponent
    ],
})
export class SphModule {}
