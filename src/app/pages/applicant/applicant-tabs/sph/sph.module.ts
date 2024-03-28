import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// modules
import { SphRoutingModule } from './sph-routing.module';
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
import { SphComponent } from './sph.component';
import { SphModalComponent } from './sph-modal/sph-modal.component';

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
        TaModalComponent,
    ],
})
export class SphModule {}
