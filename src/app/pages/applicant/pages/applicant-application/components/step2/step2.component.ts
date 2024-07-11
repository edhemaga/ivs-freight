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
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// helpers
import {
    isAnyValueInArrayFalse,
    isFormValueNotEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { ApplicantMapper } from '@pages/applicant/utils/helpers/applicant.mapper';

// services
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { ApplicantApplicationStringEnum } from '@pages/applicant/pages/applicant-application/enums/applicant-application-string.enum';

// routes
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

// models
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
import { WorkExperienceReview } from '@pages/applicant/pages/applicant-application/models/work-experience-review.model';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { Step2FormComponent } from '@pages/applicant/components/applicant-forms/step2-form/step2-form.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        Step2FormComponent,
        ApplicantAddSaveBtnComponent,
        TaAppTooltipV2Component,
        TaCheckboxComponent,
        ApplicantNextBackBtnComponent
    ],
})
export class Step2Component implements OnInit, OnDestroy, AfterContentChecked {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public applicantId: number;

    public workExperienceForm: UntypedFormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public workExperienceArray = [];

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

    public applicantSvgRoutes = ApplicantSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private applicantActionsService: ApplicantService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.initMode();

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
        const formControls = {
            noWorkExperience: [false],
        };
        for (let i = 1; i <= 10; i++) {
            formControls[`cardReview${i}`] = [null];
        }
        this.workExperienceForm = this.formBuilder.group(formControls);
    }

    public initMode(): void {
        this.applicantQuery.selectedMode$
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedMode: string) => {
                this.selectedMode = selectedMode;
            });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.workExperience) {
                    this.stepHasValues = true;

                    this.patchStepValues(res.workExperience);
                }
            });
    }

    public patchStepValues(stepValues: WorkExperienceFeedbackResponse): void {
        const { haveWorkExperience, workExperienceItems } = stepValues;

        this.workExperienceForm
            .get(ApplicantApplicationStringEnum.NoWorkExperience)
            .patchValue(haveWorkExperience);

        if (!haveWorkExperience) {
            const filteredWorkExperienceArray =
                ApplicantMapper.mapWorkExperienceItems(workExperienceItems);

            const filteredLastItemInWorkExperienceArray =
                filteredWorkExperienceArray[
                    filteredWorkExperienceArray.length - 1
                ];

            this.lastWorkExperienceCard = {
                ...filteredLastItemInWorkExperienceArray,
            };
            this.workExperienceArray = JSON.parse(
                JSON.stringify(filteredWorkExperienceArray)
            );
            this.previousFormValuesOnReview = {
                ...filteredLastItemInWorkExperienceArray,
            };
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
                            (item) => !Object.keys(item).length
                        );
                    const indexOfFirstEmptyObjectInList =
                        this.openAnnotationArray.indexOf(
                            firstEmptyObjectInList
                        );

                    this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
                        lineIndex: indexOfFirstEmptyObjectInList,
                        lineInputs: [false],
                        displayAnnotationButton: false,
                        displayAnnotationTextArea: false,
                    };

                    const workExperienceItemReview = {
                        ...workExperienceItemsReview[i],
                    };
                    delete workExperienceItemReview.isPrimary;

                    const hasIncorrectValue = workExperienceItemsReview[0]
                        ? Object.values(workExperienceItemReview).includes(
                              false
                          )
                        : false;

                    const incorrectMessage =
                        workExperienceItemReview?.commonMessage || null;

                    this.openAnnotationArray[i] = {
                        ...this.openAnnotationArray[i],
                        lineInputs: [hasIncorrectValue],
                        displayAnnotationButton:
                            hasIncorrectValue && !incorrectMessage,
                        displayAnnotationTextArea: !!incorrectMessage,
                    };

                    const inputFieldsArray = JSON.stringify(
                        this.openAnnotationArray
                            .filter((item) => Object.keys(item).length)
                            .map((item) => item.lineInputs)
                    );

                    this.cardsWithIncorrectFields =
                        inputFieldsArray.includes('true');

                    this.workExperienceForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            const workExperienceItemsReview = workExperienceItems.map(
                (item) => item.workExperienceItemReview
            );

            this.stepFeedbackValues = workExperienceItemsReview.map((item) => ({
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
            }));

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
                            currentEmployment:
                                this.lastWorkExperienceCard?.currentEmployment,
                            classesOfEquipment:
                                this.lastWorkExperienceCard?.classesOfEquipment,
                            cfrPart: this.lastWorkExperienceCard?.cfrPart,
                            fmcsa: this.lastWorkExperienceCard?.fmcsa,
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

    public onDeleteWorkExperience(): void {
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
                this.workExperienceArray.splice(
                    this.selectedWorkExperienceIndex,
                    1
                );
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
                isDrivingPosition: false,
                currentEmployment: null,
                classesOfEquipment: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedWorkExperienceIndex = -1;
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

            isDrivingPosition: false,
            currentEmployment: null,
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

    public cancelWorkExperienceEditing(): void {
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
                isDrivingPosition: false,
                currentEmployment: null,
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

            isDrivingPosition: false,
            currentEmployment: null,
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

                isDrivingPosition: false,
                currentEmployment: null,
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
        if (!this.stepFeedbackValues) return;

        const incorrectValuesArray: boolean[] = [];

        this.stepFeedbackValues.forEach((feedbackValue, i) => {
            const filteredWorkExperienceIncorrectValues = Object.keys(
                feedbackValue
            )
                .filter(
                    (key) =>
                        key !== ApplicantApplicationStringEnum.HasIncorrectValue
                )
                .reduce((obj, key) => {
                    if (!feedbackValue[key]) obj[key] = false;
                    return obj;
                }, {});

            const hasIncorrectValues = Object.keys(
                filteredWorkExperienceIncorrectValues
            ).length;

            if (hasIncorrectValues) {
                const filteredUpdatedFieldsWithIncorrectValues = Object.keys(
                    filteredWorkExperienceIncorrectValues
                ).reduce((obj, key) => {
                    const fieldName = key
                        .replace('Valid', '')
                        .replace('is', '')
                        .trim()
                        .toLowerCase();
                    const fieldValue =
                        i === this.stepFeedbackValues.length - 1
                            ? this.lastWorkExperienceCard[fieldName]
                            : this.workExperienceArray[i][fieldName];

                    obj[fieldName] =
                        fieldName === ApplicantApplicationStringEnum.From ||
                        fieldName === ApplicantApplicationStringEnum.To
                            ? MethodsCalculationsHelper.convertDateFromBackend(
                                  fieldValue
                              )
                            : fieldValue;

                    if (fieldName === ApplicantApplicationStringEnum.Address) {
                        obj[fieldName] = JSON.stringify({
                            address: fieldValue,
                        });
                    }

                    if (
                        fieldName ===
                            ApplicantApplicationStringEnum.AddressUnit ||
                        fieldName ===
                            ApplicantApplicationStringEnum.AccountForPeriodBetween
                    ) {
                        obj[fieldName] = fieldValue;
                    }

                    return obj;
                }, {});

                const isFormNotEqual = isFormValueNotEqual(
                    filteredWorkExperienceIncorrectValues,
                    filteredUpdatedFieldsWithIncorrectValues
                );

                incorrectValuesArray.push(!isFormNotEqual);
            }
        });

        this.isFeedbackValueUpdated = incorrectValuesArray.every(Boolean);
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
                const {
                    id,
                    employer,
                    jobDescription,
                    fromDate,
                    toDate,
                    employerPhone,
                    employerEmail,
                    employerFax,
                    employerAddress,
                    isDrivingPosition,
                    currentEmployment,
                    reasonForLeaving,
                    accountForPeriod,
                    classesOfEquipment,
                } = item;
                const formattedFromDate =
                    MethodsCalculationsHelper.convertDateToBackend(fromDate);
                const formattedToDate = toDate
                    ? MethodsCalculationsHelper.convertDateToBackend(toDate)
                    : null;
                const reasonForLeavingId =
                    this.reasonsForLeaving.find(
                        (reasonItem) => reasonItem.name === reasonForLeaving
                    )?.id || null;

                const formattedClassesOfEquipment = classesOfEquipment[0]
                    ?.vehicleType
                    ? classesOfEquipment.map((classItem) => ({
                          vehicleTypeId:
                              this.vehicleType.find(
                                  (vehicleItem) =>
                                      vehicleItem.name === classItem.vehicleType
                              )?.id || null,
                          trailerTypeId:
                              this.trailerType.find(
                                  (trailerItem) =>
                                      trailerItem.name === classItem.trailerType
                              )?.id || null,
                          trailerLengthId:
                              this.trailerLengthType.find(
                                  (trailerLengthItem) =>
                                      trailerLengthItem.name ===
                                      classItem.trailerLength
                              )?.id || null,
                          cfrPart: classItem.cfrPart,
                          fmcsa: classItem.fmcsa,
                      }))
                    : [];

                return {
                    id: id || null,
                    employer,
                    jobDescription,
                    from: formattedFromDate,
                    to: formattedToDate,
                    phone: employerPhone,
                    email: employerEmail,
                    fax: employerFax,
                    address: employerAddress,
                    isDrivingPosition,
                    currentEmployment,
                    reasonForLeaving: reasonForLeavingId,
                    accountForPeriodBetween: accountForPeriod,
                    classesOfEquipment: formattedClassesOfEquipment,
                };
            }
        );

        const { noWorkExperience } = this.workExperienceForm.value;

        let filteredLastWorkExperienceCard: any;

        if (!noWorkExperience && !this.workExperienceArray.length) {
            filteredLastWorkExperienceCard = {
                id: this.lastWorkExperienceCard.id || null,
                employer: this.lastWorkExperienceCard.employer,
                jobDescription: this.lastWorkExperienceCard.jobDescription,
                from: MethodsCalculationsHelper.convertDateToBackend(
                    this.lastWorkExperienceCard.fromDate
                ),
                to: this.lastWorkExperienceCard.toDate
                    ? MethodsCalculationsHelper.convertDateToBackend(
                          this.lastWorkExperienceCard.toDate
                      )
                    : null,
                phone: this.lastWorkExperienceCard.employerPhone,
                email: this.lastWorkExperienceCard.employerEmail,
                fax: this.lastWorkExperienceCard.employerFax,
                address: {
                    ...this.lastWorkExperienceCard?.employerAddress,
                    addressUnit:
                        this.lastWorkExperienceCard?.employerAddressUnit,
                },
                currentEmployment:
                    this.lastWorkExperienceCard.currentEmployment,
                isDrivingPosition:
                    this.lastWorkExperienceCard.isDrivingPosition,
                reasonForLeaving:
                    this.reasonsForLeaving.find(
                        (item) =>
                            item.name ===
                            this.lastWorkExperienceCard.reasonForLeaving
                    )?.id || null,
                accountForPeriodBetween:
                    this.lastWorkExperienceCard.accountForPeriod,
                classesOfEquipment: this.lastWorkExperienceCard
                    .classesOfEquipment
                    ? this.lastWorkExperienceCard.classesOfEquipment.map(
                          (_, index) => ({
                              vehicleTypeId:
                                  this.vehicleType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .vehicleType
                                  )?.id || null,
                              trailerTypeId:
                                  this.trailerType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .trailerType
                                  )?.id || null,
                              trailerLengthId:
                                  this.trailerLengthType.find(
                                      (item) =>
                                          item.name ===
                                          this.lastWorkExperienceCard
                                              .classesOfEquipment[index]
                                              .trailerLength
                                  )?.id || null,
                              cfrPart:
                                  this.lastWorkExperienceCard
                                      .classesOfEquipment[index].cfrPart,
                              fmcsa: this.lastWorkExperienceCard
                                  .classesOfEquipment[index].fmcsa,
                          })
                      )
                    : [],
            };
        }

        const saveData: any = {
            applicantId: this.applicantId,
            haveWorkExperience: noWorkExperience,
            workExperienceItems: noWorkExperience
                ? []
                : !this.workExperienceArray.length
                ? [filteredLastWorkExperienceCard]
                : [...filteredWorkExperienceArray],
        };

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
                    this.applicantStore.update((store) => ({
                        ...store,
                        applicant: {
                            ...store.applicant,
                            workExperience: {
                                ...store.applicant.workExperience,
                                haveWorkExperience: noWorkExperience,
                                workExperienceItems: noWorkExperience
                                    ? null
                                    : saveData.workExperienceItems.map(
                                          (item) => ({
                                              ...item,
                                              reasonForLeaving:
                                                  this.reasonsForLeaving.find(
                                                      (reasonItem) =>
                                                          reasonItem.id ===
                                                          item.reasonForLeaving
                                                  ),
                                              classesOfEquipment:
                                                  item.classesOfEquipment.map(
                                                      (classItem) => ({
                                                          vehicleType:
                                                              this.vehicleType.find(
                                                                  (
                                                                      vehicleItem
                                                                  ) =>
                                                                      vehicleItem.id ===
                                                                      classItem.vehicleTypeId
                                                              ),
                                                          trailerType:
                                                              this.trailerType.find(
                                                                  (
                                                                      trailerItem
                                                                  ) =>
                                                                      trailerItem.id ===
                                                                      classItem.trailerTypeId
                                                              ),
                                                          trailerLength:
                                                              this.trailerLengthType.find(
                                                                  (
                                                                      trailerLengthItem
                                                                  ) =>
                                                                      trailerLengthItem.id ===
                                                                      classItem.trailerLengthId
                                                              ),
                                                      })
                                                  ),
                                          })
                                      ),
                            },
                        },
                    }));
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onSubmitReview(): void {
        const workExperienceArrayReview = this.workExperienceArray.map(
            (item, index) => {
                const itemReview = item.workExperienceItemReview || {};

                return {
                    workExperienceItemId: item.id,
                    isPrimary: false,
                    commonMessage: this.workExperienceForm.get(
                        `cardReview${index + 1}`
                    ).value,
                    ...this.getReviewValidationFields(itemReview),
                };
            }
        );

        const lastItemReview =
            this.previousFormValuesOnReview.workExperienceItemReview || {};
        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;
        const lastReviewedItemInWorkExperienceArray = {
            id: this.stepHasReviewValues ? lastItemReviewId : null,
            workExperienceItemId: lastItemId,
            isPrimary: true,
            ...this.getReviewValidationFields(
                lastItemReview,
                this.lastWorkExperienceCard
            ),
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
                    this.updateApplicantWorkExperience(
                        lastReviewedItemInWorkExperienceArray,
                        workExperienceArrayReview
                    );
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    private getReviewValidationFields(
        review: { [key: string]: any },
        card?: { [key: string]: string }
    ) {
        return {
            isEmployerValid: review.isEmployerValid ?? true,
            employerMessage: card?.firstRowReview,
            isJobDescriptionValid: review.isJobDescriptionValid ?? true,
            isFromValid: review.isFromValid ?? true,
            isToValid: review.isToValid ?? true,
            jobDescriptionMessage: card?.secondRowReview,
            isPhoneValid: review.isPhoneValid ?? true,
            isFaxValid: review.isFaxValid ?? true,
            isEmailValid: review.isEmailValid ?? true,
            contactMessage: card?.thirdRowReview,
            isAddressValid: review.isAddressValid ?? true,
            isAddressUnitValid: review.isAddressUnitValid ?? true,
            addressMessage: card?.fourthRowReview,
            isAccountForPeriodBetweenValid:
                review.isAccountForPeriodBetweenValid ?? true,
            accountForPeriodBetweenMessage: card?.seventhRowReview,
        };
    }

    private updateApplicantWorkExperience(
        lastReviewedItem: any,
        workExperienceArrayReview: WorkExperienceReview[]
    ) {
        this.applicantStore.update((store) => {
            const updatedWorkExperienceItems =
                store.applicant.workExperience.workExperienceItems.map(
                    (item, index) => {
                        return index ===
                            store.applicant.workExperience.workExperienceItems
                                .length -
                                1
                            ? {
                                  ...item,
                                  workExperienceItemReview: lastReviewedItem,
                              }
                            : {
                                  ...item,
                                  workExperienceItemReview:
                                      workExperienceArrayReview[index],
                              };
                    }
                );

            return {
                ...store,
                applicant: {
                    ...store.applicant,
                    workExperience: {
                        ...store.applicant.workExperience,
                        workExperienceItems: updatedWorkExperienceItems,
                    },
                },
            };
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
