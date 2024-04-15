import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

import { INavigation } from '@pages/applicant/models/navigation.model';
import { ApplicantCompanyInfoResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-sph-form',
    templateUrl: './applicant-sph-form.component.html',
    styleUrls: ['./applicant-sph-form.component.scss'],
})
export class ApplicantSphFormComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public companyInfo: ApplicantCompanyInfoResponse;

    public dateOfApplication: string;

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

    constructor(private applicantQuery: ApplicantQuery) {}

    ngOnInit(): void {
        this.getStepValuesFromStore();

        this.getCompanyInfo();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicantSphForm$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.isStepCompletedArray = this.isStepCompletedArray.map(
                        (item, index) => {
                            if (index === 0) {
                                return {
                                    ...item,
                                    isCompleted: res ? true : false,
                                };
                            }

                            if (index === 1) {
                                return {
                                    ...item,
                                    isCompleted: res?.sphAccidentHistory
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 2) {
                                return {
                                    ...item,
                                    isCompleted: res?.sphDrugAndAlcohol
                                        ? true
                                        : false,
                                };
                            }
                        }
                    );
                }
            });
    }

    public getCompanyInfo(): void {
        this.applicantQuery.applicantSphForm$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    this.companyInfo = res?.companyInfo;

                    this.dateOfApplication =
                        MethodsCalculationsHelper.convertDateFromBackend(
                            res?.inviteDate
                        );
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
