import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CdlCardComponent } from './cdl-card.component';

import { SharedModule } from '../../../shared/shared.module';
import { CdlCardRoutingModule } from './cdl-card-routing.module';
import { ApplicantModule } from '../../applicant.module';

@NgModule({
   declarations: [CdlCardComponent],
   imports: [CommonModule, SharedModule, CdlCardRoutingModule, ApplicantModule],
})
export class CdlCardModule {}
