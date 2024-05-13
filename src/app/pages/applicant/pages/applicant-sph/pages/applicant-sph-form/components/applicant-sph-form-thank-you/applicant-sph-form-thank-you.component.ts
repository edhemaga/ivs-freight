import { Component, OnInit } from '@angular/core';

// moment
import moment from 'moment';

@Component({
    selector: 'app-sph-form-thank-you',
    templateUrl: './applicant-sph-form-thank-you.component.html',
    styleUrls: ['./applicant-sph-form-thank-you.component.scss'],
})
export class ApplicantSphFormThankYouComponent implements OnInit {
    public copyrightYear: number;

    constructor() {}

    ngOnInit(): void {
        this.copyrightYear = moment().year();
    }
}
