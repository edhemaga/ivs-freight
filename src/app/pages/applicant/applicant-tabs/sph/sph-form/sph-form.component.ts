import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { ApplicantQuery } from '../../../state/store/applicant.query';

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

    public trackByIdentity = (index: number, item: any): number => index;

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

                    this.dateOfApplication = convertDateFromBackend(
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
