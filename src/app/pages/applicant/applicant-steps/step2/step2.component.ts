/* eslint-disable no-unused-vars */

import {
    Component,
    OnInit,
    OnDestroy,
    ChangeDetectorRef,
    AfterContentChecked,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    isAnyValueInArrayFalse,
    isEveryValueInArrayTrue,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import {
    EnumValue,
    TrailerLengthResponse,
    TrailerTypeResponse,
    TruckTypeResponse,
    CreateWorkExperienceReviewCommand,
    WorkExperienceFeedbackResponse,
    ApplicantResponse,
    ApplicantModalResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy, AfterContentChecked {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public applicantId: number;

    public workExperienceForm: UntypedFormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public workExperienceArray /* : WorkExpereienceModel[]  */ = [
        {
            id: 1,
            isEditingWorkExperience: false,
            workExperienceItemReview: null,
            employer: 'asdas',
            employerPhone: '(222) 222-2222',
            employerEmail: 'asd@asd.com',
            employerFax: '(122) 222-2222',
            employerAddress: {
                address: 'Chimney Rock Rd, Houston, TX, US',
            },
            employerAddressUnit: '2',
            jobDescription: 'Asd',
            fromDate: '01/07/23',
            toDate: '01/07/23',
            reasonForLeaving: 'Better opportunity',
            accountForPeriod: 'asdas',

            isDrivingPosition: true,
            classesOfEquipment: [
                {
                    vehicleType: 'Semi Truck',
                    trailerType: 'Reefer',
                    trailerLength: '20 ft',
                    cfrPart: true,
                    fmCSA: true,
                },
                {
                    vehicleType: 'Semi Sleeper',
                    trailerType: 'Dry Van',
                    trailerLength: '22 ft',
                    cfrPart: false,
                    fmCSA: false,
                },
                {
                    vehicleType: 'Spotter',
                    trailerType: 'Side Kit',
                    trailerLength: '24 ft',
                    cfrPart: true,
                    fmCSA: false,
                },
            ],
        },
    ];

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public lastWorkExperienceCard: any;

    public selectedWorkExperienceIndex: number;

    public isEditing: boolean = false;
    public isReviewingCard: boolean = false;

    public displayButtonInsteadOfForm: boolean = false;
    public hideFormOnEdit: boolean = false;

    public formValuesToPatch: any;
    public annotationMessagesOnReview: any;

    public vehicleType: TruckTypeResponse[] = [];
    public trailerType: TrailerTypeResponse[] = [];
    public trailerLengthType: TrailerLengthResponse[] = [];

    public reasonsForLeaving: EnumValue[] = [];

    public displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
    ];
    public checkIsRadioUnchecked: boolean = false;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
    public hasIncorrectFields: boolean = false;
    public cardsWithIncorrectFields: boolean = false;
    public previousFormValuesOnReview: any;

    public stepFeedbackValues: any;
    public feedbackValuesToPatch: any;
    public isFeedbackValueUpdated: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getStepValuesFromStore();

        this.getDropdownLists();

        this.hasNoWorkExperience();
    }

    ngAfterContentChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.workExperienceForm = this.formBuilder.group({
            cardReview1: [null],
            cardReview2: [null],
            cardReview3: [null],
            cardReview4: [null],
            cardReview5: [null],
            cardReview6: [null],
            cardReview7: [null],
            cardReview8: [null],
            cardReview9: [null],
            cardReview10: [null],

            noWorkExperience: [false],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.workExperience) {
                    this.patchStepValues(res.workExperience);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: WorkExperienceFeedbackResponse): void {
        const { haveWorkExperience, workExperienceItems } = stepValues;

        this.workExperienceForm
            .get('noWorkExperience')
            .patchValue(haveWorkExperience);

        if (!haveWorkExperience) {
            const lastItemInWorkExperienceArray =
                workExperienceItems[workExperienceItems.length - 1];

            const restOfTheItemsInWorkExperienceArray = [
                ...workExperienceItems,
            ];

            const filteredWorkExperienceArray =
                restOfTheItemsInWorkExperienceArray.map((item) => {
                    return {
                        id: item.id,
                        reviewId: item.workExperienceItemReview?.id,
                        isEditingWorkExperience: false,
                        employer: item.employer,
                        jobDescription: item.jobDescription,
                        fromDate: convertDateFromBackend(item.from).replace(
                            /-/g,
                            '/'
                        ),
                        toDate: convertDateFromBackend(item.to).replace(
                            /-/g,
                            '/'
                        ),
                        employerPhone: item.phone,
                        employerEmail: item.email,
                        employerFax: item.fax,
                        employerAddress: item.address,
                        employerAddressUnit: item.address.addressUnit,
                        isDrivingPosition: item.isDrivingPosition,
                        // cfrPart: item.cfrPart,
                        // fmCSA: item.fmcsa,
                        reasonForLeaving: item.reasonForLeaving.name,
                        accountForPeriod: item.accountForPeriodBetween,
                        classesOfEquipment: item.classesOfEquipment[0]
                            ?.vehicleType
                            ? item.classesOfEquipment.map((_, index) => {
                                  return {
                                      isEditingClassOfEquipment: false,
                                      trailerLength:
                                          item.classesOfEquipment[index]
                                              .trailerLength.name,
                                      trailerType:
                                          item.classesOfEquipment[index]
                                              .trailerType.name,
                                      vehicleType:
                                          item.classesOfEquipment[index]
                                              .vehicleType.name,
                                      trailerTypeImageLocation:
                                          item.classesOfEquipment[index]
                                              .trailerType.logoName,
                                      vehicleTypeImageLocation:
                                          item.classesOfEquipment[index]
                                              .vehicleType.logoName,
                                  };
                              })
                            : [],
                        workExperienceItemReview: item.workExperienceItemReview
                            ? item.workExperienceItemReview
                            : null,
                    };
                });

            const filteredLastItemInWorkExperienceArray = {
                id: lastItemInWorkExperienceArray.id,
                reviewId:
                    lastItemInWorkExperienceArray.workExperienceItemReview?.id,
                isEditingWorkExperience: false,
                employer: lastItemInWorkExperienceArray.employer,
                jobDescription: lastItemInWorkExperienceArray.jobDescription,
                fromDate: convertDateFromBackend(
                    lastItemInWorkExperienceArray.from
                ).replace(/-/g, '/'),
                toDate: convertDateFromBackend(
                    lastItemInWorkExperienceArray.to
                ).replace(/-/g, '/'),
                employerPhone: lastItemInWorkExperienceArray.phone,
                employerEmail: lastItemInWorkExperienceArray.email,
                employerFax: lastItemInWorkExperienceArray.fax,
                employerAddress: lastItemInWorkExperienceArray.address,
                employerAddressUnit:
                    lastItemInWorkExperienceArray.address.addressUnit,
                isDrivingPosition:
                    lastItemInWorkExperienceArray.isDrivingPosition,
                // cfrPart: lastItemInWorkExperienceArray.cfrPart,
                // fmCSA: lastItemInWorkExperienceArray.fmcsa,
                reasonForLeaving:
                    lastItemInWorkExperienceArray.reasonForLeaving.name,
                accountForPeriod:
                    lastItemInWorkExperienceArray.accountForPeriodBetween,
                classesOfEquipment: lastItemInWorkExperienceArray
                    .classesOfEquipment[0]?.vehicleType
                    ? lastItemInWorkExperienceArray.classesOfEquipment.map(
                          (_, index) => {
                              return {
                                  isEditingClassOfEquipment: false,
                                  trailerLength:
                                      lastItemInWorkExperienceArray
                                          .classesOfEquipment[index]
                                          .trailerLength.name,
                                  trailerType:
                                      lastItemInWorkExperienceArray
                                          .classesOfEquipment[index].trailerType
                                          .name,
                                  vehicleType:
                                      lastItemInWorkExperienceArray
                                          .classesOfEquipment[index].vehicleType
                                          .name,
                                  trailerTypeImageLocation:
                                      lastItemInWorkExperienceArray
                                          .classesOfEquipment[index].trailerType
                                          .logoName,
                                  vehicleTypeImageLocation:
                                      lastItemInWorkExperienceArray
                                          .classesOfEquipment[index].vehicleType
                                          .logoName,
                              };
                          }
                      )
                    : [],
                workExperienceItemReview:
                    lastItemInWorkExperienceArray.workExperienceItemReview
                        ? lastItemInWorkExperienceArray.workExperienceItemReview
                        : null,
            };

            this.lastWorkExperienceCard = {
                ...filteredLastItemInWorkExperienceArray,
            };

            this.workExperienceArray = JSON.parse(
                JSON.stringify(filteredWorkExperienceArray)
            );

            this.previousFormValuesOnReview =
                filteredLastItemInWorkExperienceArray;

            this.formStatus = 'VALID';

            this.displayButtonInsteadOfForm = true;
        } else {
            this.formStatus = 'VALID';
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            const workExperienceItemsReview = workExperienceItems.map(
                (item) => item.workExperienceItemReview
            );

            if (workExperienceItemsReview[0]) {
                this.stepHasReviewValues = true;

                workExperienceItemsReview.pop();

                for (let i = 0; i < workExperienceItemsReview.length; i++) {
                    const firstEmptyObjectInList =
                        this.openAnnotationArray.find(
                            (item) => Object.keys(item).length === 0
                        );

                    const indexOfFirstEmptyObjectInList =
                        this.openAnnotationArray.indexOf(
                            firstEmptyObjectInList
                        );

                    this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
                        lineIndex: this.openAnnotationArray.indexOf(
                            firstEmptyObjectInList
                        ),
                        lineInputs: [false],
                        displayAnnotationButton: false,
                        displayAnnotationTextArea: false,
                    };

                    const workExperienceItemReview = {
                        ...workExperienceItemsReview[i],
                    };

                    delete workExperienceItemReview.isPrimary;

                    let hasIncorrectValue: boolean;

                    if (workExperienceItemsReview[0]) {
                        hasIncorrectValue = Object.values(
                            workExperienceItemReview
                        ).includes(false);
                    }

                    const incorrectMessage =
                        workExperienceItemReview?.commonMessage;

                    if (
                        hasIncorrectValue === null ||
                        hasIncorrectValue == undefined
                    ) {
                        hasIncorrectValue = false;
                    }

                    this.openAnnotationArray[i] = {
                        ...this.openAnnotationArray[i],
                        lineInputs: [hasIncorrectValue],
                        displayAnnotationButton:
                            hasIncorrectValue && !incorrectMessage
                                ? true
                                : false,
                        displayAnnotationTextArea: incorrectMessage
                            ? true
                            : false,
                    };

                    const inputFieldsArray = JSON.stringify(
                        this.openAnnotationArray
                            .filter((item) => Object.keys(item).length !== 0)
                            .map((item) => item.lineInputs)
                    );

                    if (inputFieldsArray.includes('true')) {
                        this.cardsWithIncorrectFields = true;
                    } else {
                        this.cardsWithIncorrectFields = false;
                    }

                    this.workExperienceForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage ? incorrectMessage : null);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            const workExperienceItemsReview = workExperienceItems.map(
                (item) => item.workExperienceItemReview
            );

            this.stepFeedbackValues = workExperienceItemsReview.map((item) => {
                return {
                    isEmployerValid: item.isEmployerValid,
                    employerMessage: item.employerMessage,
                    isJobDescriptionValid: item.isJobDescriptionValid,
                    isFromValid: item.isFromValid,
                    isToValid: item.isToValid,
                    jobDescriptionMessage: item.jobDescriptionMessage,
                    isPhoneValid: item.isPhoneValid,
                    isEmailValid: item.isEmailValid,
                    isFaxValid: item.isFaxValid,
                    contactMessage: item.contactMessage,
                    isAddressValid: item.isAddressValid,
                    isAddressUnitValid: item.isAddressUnitValid,
                    addressMessage: item.addressMessage,
                    isAccountForPeriodBetweenValid:
                        item.isAccountForPeriodBetweenValid,
                    accountForPeriodBetweenMessage:
                        item.accountForPeriodBetweenMessage,
                    commonMessage: item.commonMessage,
                    hasIncorrectValue: isAnyValueInArrayFalse([
                        item.isEmployerValid,
                        item.isJobDescriptionValid,
                        item.isFromValid,
                        item.isToValid,
                        item.isPhoneValid,
                        item.isEmailValid,
                        item.isFaxValid,
                        item.isAddressValid,
                        item.isAddressUnitValid,
                        item.isAccountForPeriodBetweenValid,
                    ]),
                };
            });

            this.stepValues = stepValues.workExperienceItems;

            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues?.length - 1];
        }
    }

    private hasNoWorkExperience(): void {
        this.workExperienceForm
            .get('noWorkExperience')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.formStatus = 'VALID';
                } else {
                    if (this.lastWorkExperienceCard) {
                        this.formValuesToPatch = {
                            employer: this.lastWorkExperienceCard?.employer,
                            jobDescription:
                                this.lastWorkExperienceCard?.jobDescription,
                            fromDate: this.lastWorkExperienceCard?.fromDate,
                            toDate: this.lastWorkExperienceCard?.toDate,
                            employerPhone:
                                this.lastWorkExperienceCard?.employerPhone,
                            employerEmail:
                                this.lastWorkExperienceCard?.employerEmail,
                            employerFax:
                                this.lastWorkExperienceCard?.employerFax,
                            employerAddress:
                                this.lastWorkExperienceCard?.employerAddress,
                            employerAddressUnit:
                                this.lastWorkExperienceCard
                                    ?.employerAddressUnit,
                            isDrivingPosition:
                                this.lastWorkExperienceCard?.isDrivingPosition,
                            classesOfEquipment:
                                this.lastWorkExperienceCard?.classesOfEquipment,
                            cfrPart: this.lastWorkExperienceCard?.cfrPart,
                            fmCSA: this.lastWorkExperienceCard?.fmCSA,
                            reasonForLeaving:
                                this.lastWorkExperienceCard?.reasonForLeaving,
                            accountForPeriod:
                                this.lastWorkExperienceCard?.accountForPeriod,
                        };
                    }

                    this.formStatus = 'INVALID';
                }
            });
    }

    public onDeleteWorkExperience(index: number): void {
        if (this.isEditing) {
            return;
        }

        this.workExperienceArray.splice(index, 1);
    }

    public getWorkExperienceFormValues(event: any): void {
        this.workExperienceArray = [...this.workExperienceArray, event];

        this.isEditing = true;

        this.formValuesToPatch = {
            employer: null,
            employerPhone: null,
            employerEmail: null,
            employerFax: null,
            employerAddress: null,
            employerAddressUnit: null,
            jobDescription: null,
            fromDate: null,
            toDate: null,
            reasonForLeaving: null,
            accountForPeriod: null,

            isDrivingPosition: null,
            classesOfEquipment: null,
        };

        if (this.lastWorkExperienceCard.id) {
            this.workExperienceArray[this.workExperienceArray.length - 1].id =
                this.lastWorkExperienceCard.id;

            this.lastWorkExperienceCard.id = null;
        } else {
            this.workExperienceArray[this.workExperienceArray.length - 1].id =
                null;
        }
    }

    public onEditWorkExperience(index: number): void {
        this.workExperienceArray
            .filter((item) => item.isEditingWorkExperience)
            .forEach((item) => (item.isEditingWorkExperience = false));

        this.selectedWorkExperienceIndex = index;

        this.isEditing = true;
        this.workExperienceArray[
            this.selectedWorkExperienceIndex
        ].isEditingWorkExperience = true;

        this.hideFormOnEdit = true;
        this.displayButtonInsteadOfForm = false;

        const selectedWorkExperience =
            this.workExperienceArray[this.selectedWorkExperienceIndex];

        this.formValuesToPatch = selectedWorkExperience;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.selectedWorkExperienceIndex];
        }
    }

    public cancelWorkExperienceEditing(_: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;

        if (this.workExperienceArray.length === 1) {
            const selectedWorkExperience = this.workExperienceArray[0];

            this.formValuesToPatch = selectedWorkExperience;

            this.workExperienceArray = [];
        } else {
            if (this.selectedWorkExperienceIndex >= 0) {
                this.workExperienceArray[
                    this.selectedWorkExperienceIndex
                ].isEditingWorkExperience = false;
            }

            this.formValuesToPatch = {
                employer: null,
                employerPhone: null,
                employerEmail: null,
                employerFax: null,
                employerAddress: null,
                employerAddressUnit: null,
                jobDescription: null,
                fromDate: null,
                toDate: null,
                reasonForLeaving: null,
                accountForPeriod: null,

                isDrivingPosition: null,
                classesOfEquipment: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedWorkExperienceIndex = -1;
    }

    public saveEditedWorkExperience(event: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        if (this.selectedWorkExperienceIndex >= 0) {
            this.workExperienceArray[this.selectedWorkExperienceIndex] = {
                ...this.workExperienceArray[this.selectedWorkExperienceIndex],
                ...event,
            };
        } else {
            this.workExperienceArray = [...this.workExperienceArray, event];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;
        this.displayButtonInsteadOfForm = true;

        this.formValuesToPatch = {
            employer: null,
            employerPhone: null,
            employerEmail: null,
            employerFax: null,
            employerAddress: null,
            employerAddressUnit: null,
            jobDescription: null,
            fromDate: null,
            toDate: null,
            reasonForLeaving: null,
            accountForPeriod: null,

            isDrivingPosition: null,
            classesOfEquipment: null,
        };

        this.selectedWorkExperienceIndex = -1;
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.isEditing = true;

            this.displayButtonInsteadOfForm = false;

            this.formValuesToPatch = {
                employer: null,
                employerPhone: null,
                employerEmail: null,
                employerFax: null,
                employerAddress: null,
                employerAddressUnit: null,
                jobDescription: null,
                fromDate: null,
                toDate: null,
                reasonForLeaving: null,
                accountForPeriod: null,

                isDrivingPosition: null,
                classesOfEquipment: null,
            };
        }
    }

    public onGetFormStatus(status: string): void {
        this.formStatus = status;
    }

    public onMarkInvalidEmit(event: any): void {
        if (!event) {
            this.markFormInvalid = false;
        }
    }

    public onGetLastFormValues(event: any): void {
        this.lastWorkExperienceCard = {
            ...this.lastWorkExperienceCard,
            ...event,
        };

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (event) {
                this.startFeedbackValueChangesMonitoring();
            }
        }
    }

    public onHasIncorrectFields(event: any): void {
        if (event) {
            this.hasIncorrectFields = true;
        } else {
            this.hasIncorrectFields = false;
        }
    }

    public onGetOpenAnnotationArrayValues(event: any): void {
        this.previousFormValuesOnReview.workExperienceItemReview = {
            isEmployerValid: !event[0].lineInputs[0],
            isJobDescriptionValid: !event[1].lineInputs[0],
            isFromValid: !event[1].lineInputs[1],
            isToValid: !event[1].lineInputs[2],
            isPhoneValid: !event[2].lineInputs[0],
            isEmailValid: !event[2].lineInputs[1],
            isFaxValid: !event[2].lineInputs[2],
            isAddressValid: !event[3].lineInputs[0],
            isAddressUnitValid: !event[3].lineInputs[1],
            isAccountForPeriodBetweenValid: !event[6].lineInputs[0],
        };
    }

    public onGetCardOpenAnnotationArrayValues(event: any): void {
        this.isReviewingCard = false;

        this.workExperienceArray[
            this.selectedWorkExperienceIndex
        ].isEditingWorkExperience = false;

        this.workExperienceArray[
            this.selectedWorkExperienceIndex
        ].workExperienceItemReview = {
            isEmployerValid: !event[0].lineInputs[0],
            isJobDescriptionValid: !event[1].lineInputs[0],
            isFromValid: !event[1].lineInputs[1],
            isToValid: !event[1].lineInputs[2],
            isPhoneValid: !event[2].lineInputs[0],
            isEmailValid: !event[2].lineInputs[1],
            isFaxValid: !event[2].lineInputs[2],
            isAddressValid: !event[3].lineInputs[0],
            isAddressUnitValid: !event[3].lineInputs[1],
            isAccountForPeriodBetweenValid: !event[6].lineInputs[0],
        };

        const hasInvalidFields = JSON.stringify(
            this.workExperienceArray[this.selectedWorkExperienceIndex]
                .workExperienceItemReview
        );

        if (hasInvalidFields.includes('false')) {
            if (
                !this.openAnnotationArray[this.selectedWorkExperienceIndex]
                    .displayAnnotationTextArea
            ) {
                this.openAnnotationArray[
                    this.selectedWorkExperienceIndex
                ].displayAnnotationButton = true;
            }

            this.openAnnotationArray[
                this.selectedWorkExperienceIndex
            ].lineInputs[0] = true;

            this.cardsWithIncorrectFields = true;
        } else {
            this.openAnnotationArray[
                this.selectedWorkExperienceIndex
            ].displayAnnotationButton = false;

            this.hasIncorrectFields = false;
        }

        this.selectedWorkExperienceIndex = -1;

        const lastWorkExperienceCard = this.lastWorkExperienceCard;

        this.previousFormValuesOnReview.workExperienceItemReview = {
            ...this.previousFormValuesOnReview.workExperienceItemReview,
            employerMessage: lastWorkExperienceCard.firstRowReview,
            jobDescriptionMessage: lastWorkExperienceCard.secondRowReview,
            contactMessage: lastWorkExperienceCard.thirdRowReview,
            addressMessage: lastWorkExperienceCard.fourthRowReview,
            accountForPeriodBetweenMessage:
                lastWorkExperienceCard.seventhRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public onGetRadioRequiredNoteEmit(event: any): void {
        if (event.displayRadioRequiredNote) {
            this.displayRadioRequiredNoteArray[
                event.id
            ].displayRadioRequiredNote = true;
        } else {
            this.displayRadioRequiredNoteArray[
                event.id
            ].displayRadioRequiredNote = false;
        }
    }

    public cancelWorkExperienceReview(_: any): void {
        this.isReviewingCard = false;

        this.workExperienceArray[
            this.selectedWorkExperienceIndex
        ].isEditingWorkExperience = false;

        this.selectedWorkExperienceIndex = -1;

        const lastWorkExperienceCard = this.lastWorkExperienceCard;

        this.previousFormValuesOnReview.workExperienceItemReview = {
            ...this.previousFormValuesOnReview.workExperienceItemReview,
            employerMessage: lastWorkExperienceCard.firstRowReview,
            jobDescriptionMessage: lastWorkExperienceCard.secondRowReview,
            contactMessage: lastWorkExperienceCard.thirdRowReview,
            addressMessage: lastWorkExperienceCard.fourthRowReview,
            accountForPeriodBetweenMessage:
                lastWorkExperienceCard.seventhRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.vehicleType = res.truckTypes;

                this.trailerType = res.trailerTypes;

                this.trailerLengthType = res.trailerLenghts;

                this.reasonsForLeaving = res.reasonsForLeave;
            });
    }

    public incorrectInput(
        _: any,
        inputIndex: number,
        lineIndex: number,
        type?: string
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (type === 'card') {
            selectedInputsLine.lineInputs[inputIndex] = false;

            if (selectedInputsLine.displayAnnotationButton) {
                selectedInputsLine.displayAnnotationButton = false;
            }

            if (selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = false;
                selectedInputsLine.displayAnnotationTextArea = false;
            }

            this.workExperienceForm
                .get(`cardReview${lineIndex + 1}`)
                .patchValue(null);

            Object.keys(
                this.workExperienceArray[lineIndex].workExperienceItemReview
            ).forEach((key) => {
                this.workExperienceArray[lineIndex].workExperienceItemReview[
                    key
                ] = true;
            });

            const inputFieldsArray = JSON.stringify(
                this.openAnnotationArray
                    .filter((item) => Object.keys(item).length !== 0)
                    .map((item) => item.lineInputs)
            );

            if (inputFieldsArray.includes('true')) {
                this.cardsWithIncorrectFields = true;
            } else {
                this.cardsWithIncorrectFields = false;
            }
        }
    }

    public getAnnotationBtnClickValue(event: any): void {
        if (event.type === 'open') {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                false;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = true;
        } else {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                true;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = false;
        }
    }

    public onCardReview(index: number): void {
        if (this.isReviewingCard) {
            return;
        }

        this.selectedWorkExperienceIndex = index;

        this.workExperienceArray[index].isEditingWorkExperience = true;

        this.isReviewingCard = true;

        const selectedWorkExperience = this.workExperienceArray[index];

        this.formValuesToPatch = selectedWorkExperience;
    }

    public startFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            let incorrectValuesArray = [];

            for (let i = 0; i < this.stepFeedbackValues.length; i++) {
                const filteredWorkExperienceIncorrectValues = Object.keys(
                    this.stepFeedbackValues[i]
                )
                    .filter((item) => item !== 'hasIncorrectValue')
                    .reduce((o, key) => {
                        this.stepFeedbackValues[i][key] === false &&
                            (o[key] = this.stepFeedbackValues[i][key]);

                        return o;
                    }, {});

                const hasIncorrectValues = Object.keys(
                    filteredWorkExperienceIncorrectValues
                ).length;

                if (hasIncorrectValues) {
                    const filteredFieldsWithIncorrectValues = Object.keys(
                        filteredWorkExperienceIncorrectValues
                    ).reduce((o, key) => {
                        const keyName = key
                            .replace('Valid', '')
                            .replace('is', '')
                            .trim()
                            .toLowerCase();

                        const match = Object.keys(this.stepValues[i])
                            .filter((item) =>
                                item.toLowerCase().includes(keyName)
                            )
                            .pop();

                        o[keyName] = this.stepValues[i][match];

                        if (keyName === 'from') {
                            o['from'] = convertDateFromBackend(o['from']);
                        }

                        if (keyName === 'to') {
                            o['to'] = convertDateFromBackend(o['to']);
                        }

                        if (keyName === 'address') {
                            o['address'] = JSON.stringify({
                                address: this.stepValues[i].address.address,
                            });
                        }

                        if (keyName === 'addressunit') {
                            o['addressunit'] =
                                this.stepValues[i].address.addressUnit;
                        }

                        return o;
                    }, {});

                    const filteredUpdatedFieldsWithIncorrectValues =
                        Object.keys(filteredFieldsWithIncorrectValues).reduce(
                            (o, key) => {
                                const keyName = key;

                                const match = Object.keys(this.stepValues[i])
                                    .filter((item) =>
                                        item.toLowerCase().includes(keyName)
                                    )
                                    .pop();

                                o[keyName] =
                                    i === this.stepFeedbackValues.length - 1
                                        ? this.lastWorkExperienceCard[match]
                                        : this.workExperienceArray[i][match];

                                if (keyName === 'from') {
                                    o['from'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .fromDate
                                            : this.workExperienceArray[i]
                                                  .fromDate;
                                }

                                if (keyName === 'to') {
                                    o['to'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard.toDate
                                            : this.workExperienceArray[i]
                                                  .toDate;
                                }

                                if (keyName === 'phone') {
                                    o['phone'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .employerPhone
                                            : this.workExperienceArray[i]
                                                  .employerPhone;
                                }

                                if (keyName === 'fax') {
                                    o['fax'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .employerFax
                                            : this.workExperienceArray[i]
                                                  .employerFax;
                                }

                                if (keyName === 'email') {
                                    o['email'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .employerEmail
                                            : this.workExperienceArray[i]
                                                  .employerEmail;
                                }

                                if (keyName === 'address') {
                                    o['address'] = JSON.stringify({
                                        address:
                                            i ===
                                            this.stepFeedbackValues.length - 1
                                                ? this.lastWorkExperienceCard
                                                      .employerAddress?.address
                                                : this.workExperienceArray[i]
                                                      .employerAddress?.address,
                                    });
                                }

                                if (keyName === 'addressunit') {
                                    o['addressunit'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .employerAddressUnit
                                            : this.workExperienceArray[i]
                                                  .employerAddressUnit;
                                }

                                if (keyName === 'accountforperiodbetween') {
                                    o['accountforperiodbetween'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastWorkExperienceCard
                                                  .accountForPeriod
                                            : this.workExperienceArray[i]
                                                  .accountForPeriod;
                                }

                                return o;
                            },
                            {}
                        );

                    const isFormNotEqual = isFormValueNotEqual(
                        filteredFieldsWithIncorrectValues,
                        filteredUpdatedFieldsWithIncorrectValues
                    );

                    incorrectValuesArray = [
                        ...incorrectValuesArray,
                        isFormNotEqual,
                    ];
                }
            }

            const isCardsValueUpdated =
                isEveryValueInArrayTrue(incorrectValuesArray);

            if (isCardsValueUpdated) {
                this.isFeedbackValueUpdated = true;
            } else {
                this.isFeedbackValueUpdated = false;
            }
        }
    }

    public onStepAction(event: any): void {
        if (event.action === 'next-step') {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === 'back-step') {
            this.router.navigate([`/application/${this.applicantId}/1`]);
        }
    }

    public onSubmit(): void {
        this.checkIsRadioUnchecked = true;

        if (
            this.formStatus === 'INVALID' ||
            this.isEditing ||
            (this.selectedMode === SelectedMode.FEEDBACK &&
                !this.isFeedbackValueUpdated)
        ) {
            if (this.formStatus === 'INVALID') {
                this.markFormInvalid = true;
            }

            return;
        }

        const filteredWorkExperienceArray = this.workExperienceArray.map(
            (item) => {
                return {
                    ...((this.stepHasValues ||
                        this.selectedMode === SelectedMode.FEEDBACK) && {
                        id: item.id ? item.id : null,
                        workExperienceItemReview: item.workExperienceItemReview
                            ? {
                                  ...item.workExperienceItemReview,
                                  workExperienceItemId: item.id
                                      ? item.id
                                      : null,
                              }
                            : null,
                    }),
                    employer: item.employer,
                    jobDescription: item.jobDescription,
                    from: convertDateToBackend(item.fromDate),
                    to: convertDateToBackend(item.toDate),
                    phone: item.employerPhone,
                    email: item.employerEmail,
                    fax: item.employerFax,
                    address: item.employerAddress,
                    isDrivingPosition: item.isDrivingPosition,
                    reasonForLeaving: this.reasonsForLeaving.find(
                        (reasonItem) =>
                            reasonItem.name === item.reasonForLeaving
                    ).id,
                    accountForPeriodBetween: item.accountForPeriod,
                    classesOfEquipment: item.classesOfEquipment[0]?.vehicleType
                        ? item.classesOfEquipment.map((_, index) => {
                              return {
                                  vehicleTypeId: this.vehicleType.find(
                                      (findItem) =>
                                          findItem.name ===
                                          item.classesOfEquipment[index]
                                              .vehicleType
                                  )?.id,
                                  trailerTypeId: this.trailerType.find(
                                      (findItem) =>
                                          findItem.name ===
                                          item.classesOfEquipment[index]
                                              .trailerType
                                  )?.id,
                                  trailerLengthId: this.trailerLengthType.find(
                                      (findItem) =>
                                          findItem.name ===
                                          item.classesOfEquipment[index]
                                              .trailerLength
                                  )?.id,
                              };
                          })
                        : [],
                };
            }
        );

        const { noWorkExperience } = this.workExperienceForm.value;

        let filteredLastWorkExperienceCard: any;

        const lastWorkExperinceCardAddress = {
            ...this.lastWorkExperienceCard?.employerAddress,
            addressUnit: this.lastWorkExperienceCard?.employerAddressUnit,
        };

        if (!noWorkExperience) {
            filteredLastWorkExperienceCard = {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: this.lastWorkExperienceCard.id
                        ? this.lastWorkExperienceCard.id
                        : null,
                    workExperienceItemReview: this.lastWorkExperienceCard
                        .workExperienceItemReview
                        ? {
                              ...this.lastWorkExperienceCard
                                  .workExperienceItemReview,
                              workExperienceItemId: this.lastWorkExperienceCard
                                  .id
                                  ? this.lastWorkExperienceCard.id
                                  : null,
                          }
                        : null,
                }),
                employer: this.lastWorkExperienceCard.employer,
                jobDescription: this.lastWorkExperienceCard.jobDescription,
                from: convertDateToBackend(
                    this.lastWorkExperienceCard.fromDate
                ),
                to: convertDateToBackend(this.lastWorkExperienceCard.toDate),
                phone: this.lastWorkExperienceCard.employerPhone,
                email: this.lastWorkExperienceCard.employerEmail,
                fax: this.lastWorkExperienceCard.employerFax,
                address: lastWorkExperinceCardAddress,
                isDrivingPosition:
                    this.lastWorkExperienceCard.isDrivingPosition,
                cfrPart: this.lastWorkExperienceCard.cfrPart,
                fmcsa: this.lastWorkExperienceCard.fmCSA,
                reasonForLeaving: this.reasonsForLeaving.find(
                    (item) =>
                        item.name ===
                        this.lastWorkExperienceCard.reasonForLeaving
                ).id,
                accountForPeriodBetween:
                    this.lastWorkExperienceCard.accountForPeriod,
                classesOfEquipment: this.lastWorkExperienceCard
                    .classesOfEquipment
                    ? this.lastWorkExperienceCard.classesOfEquipment.map(
                          (_, index) => {
                              return {
                                  vehicleTypeId: this.vehicleType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .vehicleType
                                  )?.id,
                                  trailerTypeId: this.trailerType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .trailerType
                                  )?.id,
                                  trailerLengthId: this.trailerLengthType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .trailerLength
                                  )?.id,
                              };
                          }
                      )
                    : [],
            };
        }

        const saveData: any = {
            applicantId: this.applicantId,
            haveWorkExperience: noWorkExperience,
            workExperienceItems: noWorkExperience
                ? []
                : [
                      ...filteredWorkExperienceArray,
                      filteredLastWorkExperienceCard,
                  ],
        };

        const storeWorkExperienceItems = saveData.workExperienceItems.map(
            (item) => {
                return {
                    id: item.id,
                    workExperienceItemReview: item.workExperienceItemReview,
                    employer: item.employer,
                    jobDescription: item.jobDescription,
                    from: item.from,
                    to: item.to,
                    phone: item.phone,
                    email: item.email,
                    fax: item.fax,
                    address: item.address,
                    isDrivingPosition: item.isDrivingPosition,
                    cfrPart: item.cfrPart,
                    fmcsa: item.fmcsa,
                    reasonForLeaving: this.reasonsForLeaving.find(
                        (reasonItem) => reasonItem.id === item.reasonForLeaving
                    ),
                    accountForPeriodBetween: item.accountForPeriodBetween,
                    classesOfEquipment: item.classesOfEquipment.map(
                        (classItem) => {
                            return {
                                vehicleType: this.vehicleType.find(
                                    (vehicleItem) =>
                                        vehicleItem.id ===
                                        classItem.vehicleTypeId
                                ),
                                trailerType: this.trailerType.find(
                                    (trailerItem) =>
                                        trailerItem.id ===
                                        classItem.trailerTypeId
                                ),
                                trailerLength: this.trailerLengthType.find(
                                    (trailerLengthItem) =>
                                        trailerLengthItem.id ===
                                        classItem.trailerLengthId
                                ),
                            };
                        }
                    ),
                };
            }
        );

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createWorkExperience(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateWorkExperience(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/3`,
                    ]);

                    this.applicantStore.update((store) => {
                        const noWorkExperience = saveData.haveWorkExperience;

                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                workExperience: {
                                    ...store.applicant.workExperience,
                                    haveWorkExperience: noWorkExperience,
                                    workExperienceItems: noWorkExperience
                                        ? null
                                        : storeWorkExperienceItems,
                                },
                            },
                        };
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onSubmitReview(): void {
        const workExperienceArrayReview = this.workExperienceArray.map(
            (item, index) => {
                const itemReview = item.workExperienceItemReview;

                return {
                    /*  ...(this.stepHasReviewValues && {
                        id: item.reviewId,
                    }), */
                    workExperienceItemId: item.id,
                    isPrimary: false,
                    commonMessage: this.workExperienceForm.get(
                        `cardReview${index + 1}`
                    ).value,
                    isEmployerValid: itemReview
                        ? itemReview.isEmployerValid
                        : true,
                    employerMessage: null,
                    isJobDescriptionValid: itemReview
                        ? itemReview.isJobDescriptionValid
                        : true,
                    isFromValid: itemReview ? itemReview.isFromValid : true,
                    isToValid: itemReview ? itemReview.isToValid : true,
                    jobDescriptionMessage: null,
                    isPhoneValid: itemReview ? itemReview.isPhoneValid : true,
                    isFaxValid: itemReview ? itemReview.isFaxValid : true,
                    isEmailValid: itemReview ? itemReview.isEmailValid : true,
                    contactMessage: null,
                    isAddressValid: itemReview
                        ? itemReview.isAddressValid
                        : true,
                    isAddressUnitValid: itemReview
                        ? itemReview.isAddressUnitValid
                        : true,
                    addressMessage: null,
                    isAccountForPeriodBetweenValid: itemReview
                        ? itemReview.isAccountForPeriodBetweenValid
                        : true,
                    accountForPeriodBetweenMessage: null,
                };
            }
        );

        const lastItemReview =
            this.previousFormValuesOnReview.workExperienceItemReview;

        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;

        const lastReviewedItemInWorkExperienceArray = {
            ...(this.stepHasReviewValues && {
                id: lastItemReviewId,
            }),
            workExperienceItemId: lastItemId,
            isPrimary: true,
            commonMessage: null,
            isEmployerValid: lastItemReview.isEmployerValid ?? true,
            employerMessage: this.lastWorkExperienceCard.firstRowReview,
            isJobDescriptionValid: lastItemReview.isJobDescriptionValid ?? true,
            isFromValid: lastItemReview.isFromValid ?? true,
            isToValid: lastItemReview.isToValid ?? true,
            jobDescriptionMessage: this.lastWorkExperienceCard.secondRowReview,
            isPhoneValid: lastItemReview.isPhoneValid ?? true,
            isFaxValid: lastItemReview.isFaxValid ?? true,
            isEmailValid: lastItemReview.isEmailValid ?? true,
            contactMessage: this.lastWorkExperienceCard.thirdRowReview,
            isAddressValid: lastItemReview.isAddressValid ?? true,
            isAddressUnitValid: lastItemReview.isAddressUnitValid ?? true,
            addressMessage: this.lastWorkExperienceCard.fourthRowReview,
            isAccountForPeriodBetweenValid:
                lastItemReview.isAccountForPeriodBetweenValid ?? true,
            accountForPeriodBetweenMessage:
                this.lastWorkExperienceCard.seventhRowReview,
        };

        const saveData: CreateWorkExperienceReviewCommand = {
            applicantId: this.applicantId,
            workExperienceItemReviews: [
                ...workExperienceArrayReview,
                lastReviewedItemInWorkExperienceArray,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createWorkExperienceReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateWorkExperienceReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/3`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                workExperience: {
                                    ...store.applicant.workExperience,
                                    workExperienceItems:
                                        store.applicant.workExperience.workExperienceItems.map(
                                            (item, index) => {
                                                if (
                                                    index ===
                                                    store.applicant
                                                        .workExperience
                                                        .workExperienceItems
                                                        .length -
                                                        1
                                                ) {
                                                    return {
                                                        ...item,
                                                        workExperienceItemReview:
                                                            lastReviewedItemInWorkExperienceArray,
                                                    };
                                                }

                                                return {
                                                    ...item,
                                                    workExperienceItemReview:
                                                        workExperienceArrayReview[
                                                            index
                                                        ],
                                                };
                                            }
                                        ),
                                },
                            },
                        };
                    });
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
