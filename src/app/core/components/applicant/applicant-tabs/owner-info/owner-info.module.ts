import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwnerInfoComponent } from './owner-info.component';

import { SharedModule } from '../../../shared/shared.module';
import { OwnerInfoRoutingModule } from './owner-info-routing.module';
import { ApplicantModule } from '../../applicant.module';

@NgModule({
    declarations: [OwnerInfoComponent],
    imports: [
        CommonModule,
        SharedModule,
        OwnerInfoRoutingModule,
        ApplicantModule,
    ],
})
export class OwnerInfoModule {}
