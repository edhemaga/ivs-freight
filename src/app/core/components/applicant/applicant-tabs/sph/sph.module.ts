import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SphComponent } from './sph.component';
import { SphModalComponent } from './sph-modal/sph-modal.component';

import { SharedModule } from '../../../shared/shared.module';
import { SphRoutingModule } from './sph-routing.module';
import { ApplicantModule } from './../../applicant.module';

@NgModule({
   declarations: [SphComponent, SphModalComponent],
   imports: [CommonModule, SharedModule, SphRoutingModule, ApplicantModule],
})
export class SphModule {}
