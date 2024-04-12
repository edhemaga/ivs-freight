import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { ApplicantSphRoutingModule } from './applicant-sph-routing.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaInputArrowsComponent } from '@shared/components/ta-input-arrows/ta-input-arrows.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';

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
        TaInputAddressDropdownComponent,
        TaInputArrowsComponent,
        TaInputDropdownComponent,
        TaModalComponent,
    ],
})
export class ApplicantSphModule {}
