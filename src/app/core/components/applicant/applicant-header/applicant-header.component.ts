import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { ApplicantQuery } from '../state/store/applicant.query';

import { SelectedMode } from '../state/enum/selected-mode.enum';
import { INavigation } from '../state/model/navigation.model';
import { ApplicantResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-applicant-header',
    templateUrl: './applicant-header.component.html',
    styleUrls: ['./applicant-header.component.scss'],
})
export class ApplicantHeaderComponent implements OnInit, OnChanges {
    @Input() mode: string;

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public applicantId: number;

    public menuItems: INavigation[] = [
        {
            title: 'Application',
            iconSrc: 'assets/svg/applicant/user.svg',
            route: '/application',
        },
        {
            title: 'Owner Info',
            iconSrc: 'assets/svg/common/ic_company.svg',
            route: '/owner-info',
        },
        {
            title: 'Medical Cert.',
            iconSrc: 'assets/svg/applicant/medical.svg',
            route: '/medical-certificate',
        },
        {
            title: 'MVR Auth.',
            iconSrc: 'assets/svg/applicant/car.svg',
            route: '/mvr-authorization',
        },
        {
            title: 'PSP Auth.',
            iconSrc: 'assets/svg/applicant/case.svg',
            route: '/psp-authorization',
        },
        {
            title: 'SPH',
            iconSrc: 'assets/svg/applicant/shield.svg',
            route: '/sph',
        },
        {
            title: 'HOS Rules',
            iconSrc: 'assets/svg/applicant/clock.svg',
            route: '/hos-rules',
        },
        {
            title: 'SSN Card',
            iconSrc: 'assets/svg/applicant/ssn.svg',
            route: '/ssn-card',
        },
        {
            title: 'CDL Card',
            iconSrc: 'assets/svg/applicant/card.svg',
            route: '/cdl-card',
        },
    ];

    public isTabCompletedArray: { id: number; isCompleted: boolean }[] = [
        { id: 0, isCompleted: false },
        { id: 1, isCompleted: false },
        { id: 2, isCompleted: false },
        { id: 3, isCompleted: false },
        { id: 4, isCompleted: false },
        { id: 5, isCompleted: false },
        { id: 6, isCompleted: false },
        { id: 7, isCompleted: false },
        { id: 8, isCompleted: false },
    ];

    reviewStoreArr = [
        { id: 0, isReviewed: false, hasIncorrectAnswer: false },
        { id: 1, isReviewed: false, hasIncorrectAnswer: false },
        { id: 2, isReviewed: false, hasIncorrectAnswer: false },
        { id: 3, isReviewed: false, hasIncorrectAnswer: false },
        { id: 4, isReviewed: false, hasIncorrectAnswer: false },
        { id: 5, isReviewed: false, hasIncorrectAnswer: false },
        { id: 6, isReviewed: false, hasIncorrectAnswer: false },
        { id: 7, isReviewed: false, hasIncorrectAnswer: false },
        { id: 8, isReviewed: false, hasIncorrectAnswer: false },
    ];

    feedbackStoreArr = [
        { id: 0, hasIncorrectAnswer: false },
        { id: 1, hasIncorrectAnswer: true },
        { id: 2, hasIncorrectAnswer: false },
        { id: 3, hasIncorrectAnswer: false },
        { id: 4, hasIncorrectAnswer: false },
        { id: 5, hasIncorrectAnswer: false },
        { id: 6, hasIncorrectAnswer: false },
        { id: 7, hasIncorrectAnswer: false },
        { id: 8, hasIncorrectAnswer: false },
    ];

    constructor(private applicantQuery: ApplicantQuery) {}

    ngOnInit(): void {
        this.getStepValuesFromStore();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode?.previousValue !== changes.mode?.currentValue) {
            this.selectedMode = changes.mode?.currentValue;
        }
    }

    public trackByIdentity = (index: number, _: any): number => index;

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (this.selectedMode === SelectedMode.APPLICANT) {
                    this.isTabCompletedArray = this.isTabCompletedArray.map(
                        (item, index) => {
                            if (index === 0) {
                                return {
                                    ...item,
                                    isCompleted:
                                        res.personalInfo &&
                                        res.workExperience &&
                                        res.cdlInformation &&
                                        res.accidentRecords &&
                                        res.trafficViolation &&
                                        res.education &&
                                        res.sevenDaysHos &&
                                        res.drugAndAlcohol &&
                                        res.driverRight &&
                                        res.disclosureRelease &&
                                        res.authorization
                                            ? true
                                            : false,
                                };
                            }

                            if (index === 1) {
                                return item;
                            }

                            if (index === 2) {
                                return {
                                    ...item,
                                    isCompleted: res.medicalCertificate
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 3) {
                                return {
                                    ...item,
                                    isCompleted: res.mvrAuth ? true : false,
                                };
                            }

                            if (index === 4) {
                                return {
                                    ...item,
                                    isCompleted: res.pspAuth ? true : false,
                                };
                            }

                            if (index === 5) {
                                return {
                                    ...item,
                                    isCompleted: res.sph ? true : false,
                                };
                            }

                            if (index === 6) {
                                return {
                                    ...item,
                                    isCompleted: res.hosRule ? true : false,
                                };
                            }

                            if (index === 7) {
                                return {
                                    ...item,
                                    isCompleted: res.ssn ? true : false,
                                };
                            }

                            if (index === 8) {
                                return {
                                    ...item,
                                    isCompleted: res.cdlCard ? true : false,
                                };
                            }
                        }
                    );
                }
            });
    }
}
