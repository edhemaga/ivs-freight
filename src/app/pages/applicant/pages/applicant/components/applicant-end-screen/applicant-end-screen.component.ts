import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// models
import {
    ApplicantCompanyInfoResponse,
    ApplicantResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-applicant-end-screen',
    templateUrl: './applicant-end-screen.component.html',
    styleUrls: ['./applicant-end-screen.component.scss'],
})
export class ApplicantEndScreenComponent implements OnInit {
    private destroy$ = new Subject<void>();

    public currentDate: string;
    public copyrightYear: string;

    public companyInfo: ApplicantCompanyInfoResponse;

    constructor(private applicantQuery: ApplicantQuery) {}

    ngOnInit(): void {
        this.currentDate = moment().format('MM/DD/YY');
        this.copyrightYear = moment().format('YYYY');

        this.getStepValuesFromStore();
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.companyInfo = res.companyInfo;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
