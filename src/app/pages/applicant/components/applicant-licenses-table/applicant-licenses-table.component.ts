import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

// models
import { License } from '@pages/applicant/pages/applicant-application/models/license.model';

@Component({
    selector: 'app-applicant-licenses-table',
    templateUrl: './applicant-licenses-table.component.html',
    styleUrls: ['./applicant-licenses-table.component.scss'],
    standalone: true,
    imports: [CommonModule],
})
export class ApplicantLicensesTableComponent {
    @Input() selectedMode: string;
    @Input() licenses: License[];

    constructor() {}
}
