import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SsnCardComponent } from './ssn-card.component';

import { SharedModule } from '../../../shared/shared.module';
import { SsnCardRoutingModule } from './ssn-card-routing.module';
import { ApplicantModule } from './../../applicant.module';

@NgModule({
    declarations: [SsnCardComponent],
    imports: [
        CommonModule,
        SharedModule,
        SsnCardRoutingModule,
        ApplicantModule,
    ],
})
export class SsnCardModule {}
