import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

// routes
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

// models
import { WorkExperienceItemMapped } from '@pages/applicant/models/work-experience-mapped.model';

@Component({
    selector: 'app-applicant-work-experience-table',
    templateUrl: './applicant-work-experience-table.component.html',
    styleUrls: ['./applicant-work-experience-table.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaAppTooltipV2Component,
    ],
})
export class ApplicantWorkExperienceTableComponent {
    @Input() workExperienceArray: WorkExperienceItemMapped[];

    public applicantSvgRoutes = ApplicantSvgRoutes;

    constructor() {}
}
