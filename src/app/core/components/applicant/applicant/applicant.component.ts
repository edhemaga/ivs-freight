import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import {
    isAnyPropertyInObjectFalse,
    isAnyValueInArrayTrue,
} from '../state/utils/utils';

import { ApplicantQuery } from '../state/store/applicant.query';

import { INavigation } from '../state/model/navigation.model';
import { SelectedMode } from '../state/enum/selected-mode.enum';

@Component({
    selector: 'app-applicant',
    templateUrl: './applicant.component.html',
    styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode = SelectedMode.APPLICANT;

    public menuItems: INavigation[] = [
        {
            title: 'Personal Info',
            route: '1',
            class: 'bullet-1',
        },
        {
            title: 'Work experience',
            route: '2',
            class: 'bullet-2',
        },
        {
            title: 'CDL Information',
            route: '3',
            class: 'bullet-3',
        },
        {
            title: 'Accident records',
            route: '4',
            class: 'bullet-4',
        },
        {
            title: 'Traffic violations',
            route: '5',
            class: 'bullet-5',
        },
        {
            title: 'Education',
            route: '6',
            class: 'bullet-6',
        },
        {
            title: '7 Days HOS',
            route: '7',
            class: 'bullet-7',
        },
        {
            title: 'Drug & Alcohol statement',
            route: '8',
            class: 'bullet-8',
        },
        {
            title: 'Driver rights',
            route: '9',
            class: 'bullet-9',
        },
        {
            title: 'Disclosure & release',
            route: '10',
            class: 'bullet-10',
        },
        {
            title: 'Authorization',
            route: '11',
            class: 'bullet-11',
        },
    ];

    public isStepCompletedArray: { id: number; isCompleted: boolean }[] = [
        { id: 0, isCompleted: false },
        { id: 1, isCompleted: false },
        { id: 2, isCompleted: false },
        { id: 3, isCompleted: false },
        { id: 4, isCompleted: false },
        { id: 5, isCompleted: false },
        { id: 6, isCompleted: false },
        { id: 7, isCompleted: false },
        { id: 8, isCompleted: false },
        { id: 9, isCompleted: false },
        { id: 10, isCompleted: false },
    ];

    public isStepReviewedArray: {
        id: number;
        isReviewed: boolean;
        hasIncorrectAnswer: boolean;
    }[] = [
        { id: 0, isReviewed: false, hasIncorrectAnswer: false },
        { id: 1, isReviewed: false, hasIncorrectAnswer: false },
        { id: 2, isReviewed: false, hasIncorrectAnswer: false },
        { id: 3, isReviewed: false, hasIncorrectAnswer: false },
        { id: 4, isReviewed: false, hasIncorrectAnswer: false },
        { id: 5, isReviewed: false, hasIncorrectAnswer: false },
        { id: 6, isReviewed: false, hasIncorrectAnswer: false },
        { id: 7, isReviewed: false, hasIncorrectAnswer: false },
        { id: 8, isReviewed: false, hasIncorrectAnswer: false },
        { id: 9, isReviewed: false, hasIncorrectAnswer: false },
        { id: 10, isReviewed: false, hasIncorrectAnswer: false },
    ];

    feedbackStoreArr = [
        { id: 0, hasIncorrectAnswer: false, sentToReview: false },
        { id: 1, hasIncorrectAnswer: true, sentToReview: false },
        { id: 2, hasIncorrectAnswer: false, sentToReview: true },
        { id: 3, hasIncorrectAnswer: false, sentToReview: false },
        { id: 4, hasIncorrectAnswer: false, sentToReview: false },
        { id: 5, hasIncorrectAnswer: false, sentToReview: false },
        { id: 6, hasIncorrectAnswer: false, sentToReview: false },
        { id: 7, hasIncorrectAnswer: false, sentToReview: false },
        { id: 8, hasIncorrectAnswer: false, sentToReview: false },
        { id: 9, hasIncorrectAnswer: false, sentToReview: false },
        { id: 10, hasIncorrectAnswer: false, sentToReview: false },
    ];

    constructor(private applicantQuery: ApplicantQuery) {}

    ngOnInit(): void {
        this.getStepValuesFromStore();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                res = JSON.parse(JSON.stringify(res));

                if (this.selectedMode === SelectedMode.APPLICANT) {
                    this.isStepCompletedArray = this.isStepCompletedArray.map(
                        (item, index) => {
                            if (index === 0) {
                                return {
                                    ...item,
                                    isCompleted: res.personalInfo
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 1) {
                                return {
                                    ...item,
                                    isCompleted: res.workExperience
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 2) {
                                return {
                                    ...item,
                                    isCompleted: res.cdlInformation
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 3) {
                                return {
                                    ...item,
                                    isCompleted: res.accidentRecords
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 4) {
                                return {
                                    ...item,
                                    isCompleted: res.trafficViolation
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 5) {
                                return {
                                    ...item,
                                    isCompleted: res.education ? true : false,
                                };
                            }

                            if (index === 6) {
                                return {
                                    ...item,
                                    isCompleted: res.sevenDaysHos
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 7) {
                                return {
                                    ...item,
                                    isCompleted: res.drugAndAlcohol
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 8) {
                                return {
                                    ...item,
                                    isCompleted: res.driverRight ? true : false,
                                };
                            }

                            if (index === 9) {
                                return {
                                    ...item,
                                    isCompleted: res.disclosureRelease
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 10) {
                                return {
                                    ...item,
                                    isCompleted: res.authorization
                                        ? true
                                        : false,
                                };
                            }
                        }
                    );
                }

                if (this.selectedMode === SelectedMode.REVIEW) {
                    this.isStepReviewedArray = this.isStepReviewedArray.map(
                        (item, index) => {
                            if (index === 0) {
                                const personalInfoReview =
                                    res?.personalInfo?.personalInfoReview;

                                const previousAddresses =
                                    res?.personalInfo?.previousAddresses;

                                const previousAddressesReviews =
                                    previousAddresses.map(
                                        (item) => item?.previousAddressReview
                                    );

                                let hasIncorrectValue: boolean;
                                let cardHasIncorrectValue: boolean;

                                if (personalInfoReview) {
                                    hasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            personalInfoReview
                                        );
                                }

                                if (previousAddresses) {
                                    cardHasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            previousAddressesReviews
                                        );
                                }

                                return {
                                    ...item,
                                    isReviewed: personalInfoReview
                                        ? true
                                        : false,
                                    hasIncorrectAnswer:
                                        hasIncorrectValue ||
                                        cardHasIncorrectValue,
                                };
                            }

                            if (index === 1) {
                                const workExperienceItems =
                                    res?.workExperience?.workExperienceItems;

                                const workExperienceItemsReview =
                                    workExperienceItems?.map(
                                        (item) => item?.workExperienceItemReview
                                    );

                                let filteredWorkExperienceItemsReview = [];
                                let hasIncorrectValue: boolean;

                                if (workExperienceItemsReview) {
                                    if (workExperienceItemsReview[0]) {
                                        let incorrectValuesArray = [];

                                        for (
                                            let i = 0;
                                            i <
                                            workExperienceItemsReview?.length;
                                            i++
                                        ) {
                                            const filteredItem =
                                                workExperienceItemsReview[i];

                                            delete filteredItem.isPrimary;

                                            filteredWorkExperienceItemsReview =
                                                [
                                                    ...filteredWorkExperienceItemsReview,
                                                    filteredItem,
                                                ];

                                            const objectHasIncorrectValue =
                                                isAnyPropertyInObjectFalse(
                                                    filteredItem
                                                );

                                            incorrectValuesArray = [
                                                ...incorrectValuesArray,
                                                objectHasIncorrectValue,
                                            ];
                                        }

                                        if (
                                            isAnyValueInArrayTrue(
                                                incorrectValuesArray
                                            )
                                        ) {
                                            hasIncorrectValue = true;
                                        } else {
                                            hasIncorrectValue = false;
                                        }
                                    }
                                }

                                return {
                                    ...item,
                                    isReviewed:
                                        workExperienceItemsReview &&
                                        workExperienceItemsReview[0]
                                            ? true
                                            : false,
                                    hasIncorrectAnswer: hasIncorrectValue,
                                };
                            }

                            if (index === 2) {
                                const cdlInformationReview =
                                    res?.cdlInformation?.cdlInformationReview;

                                const licenseItems =
                                    res?.cdlInformation?.licences;

                                const licensetemsReview = licenseItems?.map(
                                    (item) => item?.licenseReview
                                );

                                let hasIncorrectValue: boolean;
                                let cardHasIncorrectValue: boolean;
                                let filteredLicenseItemsReview = [];

                                if (cdlInformationReview) {
                                    hasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            cdlInformationReview
                                        );
                                }

                                if (licensetemsReview) {
                                    if (licensetemsReview[0]) {
                                        let incorrectValuesArray = [];

                                        for (
                                            let i = 0;
                                            i < licensetemsReview?.length;
                                            i++
                                        ) {
                                            const filteredItem =
                                                licensetemsReview[i];

                                            delete filteredItem.isPrimary;

                                            filteredLicenseItemsReview = [
                                                ...filteredLicenseItemsReview,
                                                filteredItem,
                                            ];

                                            const objectHasIncorrectValue =
                                                isAnyPropertyInObjectFalse(
                                                    filteredItem
                                                );

                                            incorrectValuesArray = [
                                                ...incorrectValuesArray,
                                                objectHasIncorrectValue,
                                            ];
                                        }

                                        if (
                                            isAnyValueInArrayTrue(
                                                incorrectValuesArray
                                            )
                                        ) {
                                            cardHasIncorrectValue = true;
                                        } else {
                                            cardHasIncorrectValue = false;
                                        }
                                    }
                                }

                                return {
                                    ...item,
                                    isReviewed:
                                        licensetemsReview &&
                                        licensetemsReview[0]
                                            ? true
                                            : false,
                                    hasIncorrectAnswer:
                                        hasIncorrectValue ||
                                        cardHasIncorrectValue,
                                };
                            }

                            if (index === 3) {
                                const accidentRecordItems =
                                    res?.accidentRecords?.accidents;

                                const accidentRecordItemsReview =
                                    accidentRecordItems?.map(
                                        (item) => item?.accidentItemReview
                                    );

                                let filteredAccidentRecordItemsReview = [];
                                let hasIncorrectValue: boolean;

                                if (accidentRecordItemsReview) {
                                    if (accidentRecordItemsReview[0]) {
                                        let incorrectValuesArray = [];

                                        for (
                                            let i = 0;
                                            i <
                                            accidentRecordItemsReview?.length;
                                            i++
                                        ) {
                                            const filteredItem =
                                                accidentRecordItemsReview[i];

                                            delete filteredItem.isPrimary;

                                            filteredAccidentRecordItemsReview =
                                                [
                                                    ...filteredAccidentRecordItemsReview,
                                                    filteredItem,
                                                ];

                                            const objectHasIncorrectValue =
                                                isAnyPropertyInObjectFalse(
                                                    filteredItem
                                                );

                                            incorrectValuesArray = [
                                                ...incorrectValuesArray,
                                                objectHasIncorrectValue,
                                            ];
                                        }

                                        if (
                                            isAnyValueInArrayTrue(
                                                incorrectValuesArray
                                            )
                                        ) {
                                            hasIncorrectValue = true;
                                        } else {
                                            hasIncorrectValue = false;
                                        }
                                    }
                                }

                                return {
                                    ...item,
                                    isReviewed:
                                        accidentRecordItemsReview &&
                                        accidentRecordItemsReview[0]
                                            ? true
                                            : false,
                                    hasIncorrectAnswer: hasIncorrectValue,
                                };
                            }

                            if (index === 4) {
                                const trafficViolationItems =
                                    res?.trafficViolation
                                        ?.trafficViolationItems;

                                const trafficViolationItemsReview =
                                    trafficViolationItems?.map(
                                        (item) =>
                                            item?.trafficViolationItemReview
                                    );

                                let filteredTrafficViolationItemsReview = [];
                                let hasIncorrectValue: boolean;

                                if (trafficViolationItemsReview) {
                                    if (trafficViolationItemsReview[0]) {
                                        let incorrectValuesArray = [];

                                        for (
                                            let i = 0;
                                            i <
                                            trafficViolationItemsReview?.length;
                                            i++
                                        ) {
                                            const filteredItem =
                                                trafficViolationItemsReview[i];

                                            delete filteredItem.isPrimary;

                                            filteredTrafficViolationItemsReview =
                                                [
                                                    ...filteredTrafficViolationItemsReview,
                                                    filteredItem,
                                                ];

                                            const objectHasIncorrectValue =
                                                isAnyPropertyInObjectFalse(
                                                    filteredItem
                                                );

                                            incorrectValuesArray = [
                                                ...incorrectValuesArray,
                                                objectHasIncorrectValue,
                                            ];
                                        }

                                        if (
                                            isAnyValueInArrayTrue(
                                                incorrectValuesArray
                                            )
                                        ) {
                                            hasIncorrectValue = true;
                                        } else {
                                            hasIncorrectValue = false;
                                        }
                                    }
                                }

                                return {
                                    ...item,
                                    isReviewed:
                                        trafficViolationItemsReview &&
                                        trafficViolationItemsReview[0]
                                            ? true
                                            : false,
                                    hasIncorrectAnswer: hasIncorrectValue,
                                };
                            }

                            if (index === 5) {
                                const educationReview =
                                    res?.education?.educationReview;

                                const educationItems =
                                    res?.education?.emergencyContacts;

                                const educationtemsReview = educationItems?.map(
                                    (item) => item?.emergencyContactReview
                                );

                                let cardHasIncorrectValue: boolean;
                                let hasIncorrectValue: boolean;
                                let filteredEducationItemsReview = [];

                                if (educationReview) {
                                    hasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            educationReview
                                        );
                                }

                                if (educationtemsReview) {
                                    if (educationtemsReview[0]) {
                                        let incorrectValuesArray = [];

                                        for (
                                            let i = 0;
                                            i < educationtemsReview?.length;
                                            i++
                                        ) {
                                            const filteredItem =
                                                educationtemsReview[i];

                                            delete filteredItem.isPrimary;

                                            filteredEducationItemsReview = [
                                                ...filteredEducationItemsReview,
                                                filteredItem,
                                            ];

                                            const objectHasIncorrectValue =
                                                isAnyPropertyInObjectFalse(
                                                    filteredItem
                                                );

                                            incorrectValuesArray = [
                                                ...incorrectValuesArray,
                                                objectHasIncorrectValue,
                                            ];
                                        }

                                        if (
                                            isAnyValueInArrayTrue(
                                                incorrectValuesArray
                                            )
                                        ) {
                                            cardHasIncorrectValue = true;
                                        } else {
                                            cardHasIncorrectValue = false;
                                        }
                                    }
                                }

                                return {
                                    ...item,
                                    isReviewed:
                                        educationtemsReview &&
                                        educationtemsReview[0]
                                            ? true
                                            : false,
                                    hasIncorrectAnswer:
                                        hasIncorrectValue ||
                                        cardHasIncorrectValue,
                                };
                            }

                            if (index === 6) {
                                const sevenDaysHosReview =
                                    res?.sevenDaysHos?.sevenDaysHosReview;

                                let hasIncorrectValue: boolean;

                                if (sevenDaysHosReview) {
                                    hasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            sevenDaysHosReview
                                        );
                                }

                                return {
                                    ...item,
                                    isReviewed: sevenDaysHosReview
                                        ? true
                                        : false,
                                    hasIncorrectAnswer: hasIncorrectValue,
                                };
                            }

                            if (index === 7) {
                                const drugAndAlcoholReview =
                                    res?.drugAndAlcohol?.drugAndAlcoholReview;

                                let hasIncorrectValue: boolean;

                                if (drugAndAlcoholReview) {
                                    hasIncorrectValue =
                                        isAnyPropertyInObjectFalse(
                                            drugAndAlcoholReview
                                        );
                                }

                                return {
                                    ...item,
                                    isReviewed: drugAndAlcoholReview
                                        ? true
                                        : false,
                                    hasIncorrectAnswer: hasIncorrectValue,
                                };
                            }

                            if (index === 8) {
                                const driverRightsReview =
                                    res?.driverRight?.reviewed;

                                return {
                                    ...item,
                                    isReviewed: driverRightsReview
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 9) {
                                const disclosureAndReleaseReview =
                                    res?.disclosureRelease?.reviewed;

                                return {
                                    ...item,
                                    isReviewed: disclosureAndReleaseReview
                                        ? true
                                        : false,
                                };
                            }

                            if (index === 10) {
                                const autorizationReview =
                                    res?.authorization?.reviewed;

                                return {
                                    ...item,
                                    isReviewed: autorizationReview
                                        ? true
                                        : false,
                                };
                            }
                        }
                    );
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
