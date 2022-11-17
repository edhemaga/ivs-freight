import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { ApplicantSphFormQuery } from '../../../state/store/applicant-sph-form-store/applicant-sph-form.query';

import { INavigation } from '../../../state/model/navigation.model';
import { ApplicantCompanyInfoResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-sph-form',
    templateUrl: './sph-form.component.html',
    styleUrls: ['./sph-form.component.scss'],
})
export class SphFormComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public companyInfo: ApplicantCompanyInfoResponse;

    public menuItems: INavigation[] = [
        {
            title: 'Prospective employer',
            route: '1',
            class: 'bullet-1',
        },
        {
            title: 'Accident history',
            route: '2',
            class: 'bullet-2',
        },
        {
            title: 'Drug & alcohol history',
            route: '3',
            class: 'bullet-3',
        },
    ];

    public isStepCompletedArray: { id: number; isCompleted: boolean }[] = [
        { id: 1, isCompleted: false },
        { id: 2, isCompleted: false },
        { id: 3, isCompleted: false },
    ];

    constructor(private applicantSphFormQuery: ApplicantSphFormQuery) {}

    ngOnInit(): void {
        this.getStepValuesFromStore();

        this.getCompanyInfo();
    }

    public trackByIdentity = (index: number, item: any): number => index;

    public getStepValuesFromStore(): void {
        this.applicantSphFormQuery.fullList$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.isStepCompletedArray = this.isStepCompletedArray.map(
                        (item, index) => {
                            return {
                                ...item,
                                isCompleted: res[`step${index + 1}`]
                                    ? true
                                    : false,
                            };
                        }
                    );
                }
            });
    }

    public getCompanyInfo(): void {
        this.applicantSphFormQuery.companyInfo$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                console.log('comapny', res);
                this.companyInfo = res;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
