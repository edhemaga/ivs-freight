import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ApplicantSphRoutingModule } from './applicant-sph-routing.module';
import { ApplicantModule } from '../../applicant.module';
import { SharedModule } from 'src/app/core/components/shared/shared.module';
import { TaCheckboxComponent } from 'src/app/core/components/shared/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from 'src/app/core/components/shared/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputComponent } from 'src/app/core/components/shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from 'src/app/core/components/shared/input-address-dropdown/input-address-dropdown.component';
import { TaInputArrowsComponent } from 'src/app/core/components/shared/ta-input-arrows/ta-input-arrows.component';
import { TaInputDropdownComponent } from 'src/app/core/components/shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from 'src/app/core/components/shared/ta-modal/ta-modal.component';

// components
import { ApplicantSphComponent } from './applicant-sph.component';
import { ApplicantSphModalComponent } from './components/applicant-sph-modal/applicant-sph-modal.component';

@NgModule({
    declarations: [ApplicantSphComponent, ApplicantSphModalComponent],
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantSphRoutingModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        TaInputRadiobuttonsComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
        TaInputArrowsComponent,
        TaInputDropdownComponent,
        TaModalComponent,
    ],
})
export class ApplicantSphModule {}
