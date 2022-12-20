/* eslint-disable no-unused-vars */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    anyInputInLineIncorrect,
    isAnyValueInArrayFalse,
    isEveryValueInArrayTrue,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ViolationModel } from '../../state/model/violations.model';
import {
    ApplicantModalResponse,
    ApplicantResponse,
    CreateTrafficViolationCommand,
    CreateTrafficViolationReviewCommand,
    TrafficViolationFeedbackResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step5',
    templateUrl: './step5.component.html',
    styleUrls: ['./step5.component.scss'],
})
export class Step5Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public applicantId: number;

    public violationsForm: FormGroup;
    public trafficViolationsForm: FormGroup;
    public notBeenConvictedForm: FormGroup;
    public onlyOneHoldLicenseForm: FormGroup;
    public certifyForm: FormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public violationsArray: ViolationModel[] = [];

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public lastValidLicense: any;

    public lastViolationsCard: any;

    public vehicleType: TruckTypeResponse[] = [];

    public selectedViolationIndex: number = -1;

    public isEditing: boolean = false;
    public isReviewingCard: boolean = false;

    public displayButtonInsteadOfForm: boolean = false;
    public hideFormOnEdit: boolean = false;

    public formValuesToPatch: any;

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
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.hasNoTrafficViolations();

        this.getDropdownLists();

        this.getStepValuesFromStore();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    public createForm(): void {
        this.trafficViolationsForm = this.formBuilder.group({
            noViolationsForPastTwelveMonths: [false],
        });

        this.notBeenConvictedForm = this.formBuilder.group({
            notBeenConvicted: [false, Validators.requiredTrue],
        });

        this.onlyOneHoldLicenseForm = this.formBuilder.group({
            onlyOneHoldLicense: [false, Validators.requiredTrue],
        });

        this.certifyForm = this.formBuilder.group({
            certify: [false, Validators.requiredTrue],
        });

        this.violationsForm = this.formBuilder.group({
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
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                const cdlInformation = res.cdlInformation;

                const lastLicenseAdded =
                    cdlInformation?.licences[
                        cdlInformation.licences.length - 1
                    ];

                this.lastValidLicense = {
                    license: lastLicenseAdded?.licenseNumber,
                    state: lastLicenseAdded?.state?.stateShortName,
                    classType: lastLicenseAdded?.classType.name,
                    expDate: convertDateFromBackend(lastLicenseAdded?.expDate),
                };

                if (res.trafficViolation) {
                    this.patchStepValues(res.trafficViolation);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: TrafficViolationFeedbackResponse): void {
        const {
            noViolationsForPastTwelveMonths,
            notBeenConvicted,
            onlyOneHoldLicense,
            certifyViolations,
            trafficViolationItems,
        } = stepValues;

        this.trafficViolationsForm
            .get('noViolationsForPastTwelveMonths')
            .patchValue(noViolationsForPastTwelveMonths);

        this.notBeenConvictedForm
            .get('notBeenConvicted')
            .patchValue(notBeenConvicted);

        this.onlyOneHoldLicenseForm
            .get('onlyOneHoldLicense')
            .patchValue(onlyOneHoldLicense);

        this.certifyForm.get('certify').patchValue(certifyViolations);

        if (!noViolationsForPastTwelveMonths) {
            const lastItemInViolationsArray =
                trafficViolationItems[trafficViolationItems.length - 1];

            const restOfTheItemsInViolationsArray = [...trafficViolationItems];

            restOfTheItemsInViolationsArray.pop();

            const filteredViolationsArray = restOfTheItemsInViolationsArray.map(
                (item) => {
                    return {
                        id: item.id,
                        reviewId: item.trafficViolationItemReview?.id,
                        isEditingViolation: false,
                        date: convertDateFromBackend(item.date),
                        vehicleType: item.vehicleType.name,
                        vehicleTypeLogoName: item.vehicleType.logoName,
                        location: item.location,
                        description: item.description,
                        trafficViolationItemReview:
                            item.trafficViolationItemReview
                                ? item.trafficViolationItemReview
                                : null,
                    };
                }
            );

            const filteredLastItemInViolationsArray = {
                id: lastItemInViolationsArray.id,
                reviewId:
                    lastItemInViolationsArray.trafficViolationItemReview?.id,
                isEditingViolation: false,
                date: convertDateFromBackend(lastItemInViolationsArray.date),
                vehicleType: lastItemInViolationsArray.vehicleType.name,
                vehicleTypeLogoName:
                    lastItemInViolationsArray.vehicleType.logoName,
                location: lastItemInViolationsArray.location,
                description: lastItemInViolationsArray.description,
                trafficViolationItemReview:
                    lastItemInViolationsArray.trafficViolationItemReview
                        ? lastItemInViolationsArray.trafficViolationItemReview
                        : null,
            };

            this.lastViolationsCard = {
                ...filteredLastItemInViolationsArray,
            };

            this.violationsArray = JSON.parse(
                JSON.stringify(filteredViolationsArray)
            );

            this.previousFormValuesOnReview = filteredLastItemInViolationsArray;

            if (trafficViolationItems.length === 1) {
                this.formValuesToPatch = filteredLastItemInViolationsArray;
            } else {
                this.formStatus = 'VALID';

                this.displayButtonInsteadOfForm = true;
            }
        } else {
            this.inputService.changeValidatorsCheck(
                this.notBeenConvictedForm.get('notBeenConvicted'),
                false
            );
            this.inputService.changeValidatorsCheck(
                this.onlyOneHoldLicenseForm.get('onlyOneHoldLicense'),
                false
            );
            this.inputService.changeValidatorsCheck(
                this.certifyForm.get('certify'),
                false
            );

            this.formStatus = 'VALID';
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            const violationItemsReview = trafficViolationItems.map(
                (item) => item.trafficViolationItemReview
            );

            if (violationItemsReview[0]) {
                this.stepHasReviewValues = true;

                violationItemsReview.pop();

                for (let i = 0; i < violationItemsReview.length; i++) {
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

                    const violationItemReview = {
                        ...violationItemsReview[i],
                    };

                    delete violationItemReview.isPrimary;

                    let hasIncorrectValue: boolean;

                    if (violationItemsReview[0]) {
                        hasIncorrectValue =
                            Object.values(violationItemReview).includes(false);
                    }

                    const incorrectMessage = violationItemReview?.commonMessage;

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

                    this.violationsForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage ? incorrectMessage : null);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            const trafficViolationItemsReview = trafficViolationItems.map(
                (item) => item.trafficViolationItemReview
            );

            this.stepFeedbackValues = trafficViolationItemsReview.map(
                (item) => {
                    return {
                        isDateValid: item.isDateValid,
                        isLocationValid: item.isLocationValid,
                        locationMessage: item.locationMessage,
                        isDescriptionValid: item.isDescriptionValid,
                        descriptionMessage: item.descriptionMessage,
                        commonMessage: item.commonMessage,
                        hasIncorrectValue: isAnyValueInArrayFalse([
                            item.isDateValid,
                            item.isLocationValid,
                            item.isDescriptionValid,
                        ]),
                    };
                }
            );

            this.stepValues = stepValues.trafficViolationItems;

            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues?.length - 1];
        }
    }

    private hasNoTrafficViolations(): void {
        this.trafficViolationsForm
            .get('noViolationsForPastTwelveMonths')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidatorsCheck(
                        this.notBeenConvictedForm.get('notBeenConvicted'),
                        false
                    );
                    this.inputService.changeValidatorsCheck(
                        this.onlyOneHoldLicenseForm.get('onlyOneHoldLicense'),
                        false
                    );
                    this.inputService.changeValidatorsCheck(
                        this.certifyForm.get('certify'),
                        false
                    );

                    this.formStatus = 'VALID';
                } else {
                    if (this.lastViolationsCard) {
                        this.formValuesToPatch = {
                            date: this.lastViolationsCard?.date,
                            vehicleType: this.lastViolationsCard?.vehicleType,
                            location: this.lastViolationsCard.location,
                            description: this.lastViolationsCard?.description,
                        };
                    }

                    this.inputService.changeValidatorsCheck(
                        this.notBeenConvictedForm.get('notBeenConvicted')
                    );
                    this.inputService.changeValidatorsCheck(
                        this.onlyOneHoldLicenseForm.get('onlyOneHoldLicense')
                    );
                    this.inputService.changeValidatorsCheck(
                        this.certifyForm.get('certify')
                    );

                    this.formStatus = 'INVALID';
                }
            });
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (
            this.selectedMode === SelectedMode.FEEDBACK ||
            this.selectedMode === SelectedMode.REVIEW
        ) {
            return;
        }

        if (type === InputSwitchActions.NOT_BEEN_CONVICTED) {
            this.notBeenConvictedForm.patchValue({
                notBeenConvicted:
                    !this.notBeenConvictedForm.get('notBeenConvicted').value,
            });
        }

        if (type === InputSwitchActions.CERTIFY) {
            this.certifyForm.patchValue({
                certify: !this.certifyForm.get('certify').value,
            });
        }
    }

    public onDeleteViolation(index: number): void {
        if (this.isEditing) {
            return;
        }

        this.violationsArray.splice(index, 1);
    }

    public getViolationFormValues(event: any): void {
        this.violationsArray = [...this.violationsArray, event];

        this.isEditing = true;

        this.formValuesToPatch = {
            date: null,
            vehicleType: null,
            location: null,
            description: null,
        };

        if (this.lastViolationsCard.id) {
            this.violationsArray[this.violationsArray.length - 1].id =
                this.lastViolationsCard.id;

            this.lastViolationsCard.id = null;
        } else {
            this.violationsArray[this.violationsArray.length - 1].id = null;
        }
    }

    public onEditViolation(index: number): void {
        this.violationsArray
            .filter((item) => item.isEditingViolation)
            .forEach((item) => (item.isEditingViolation = false));

        this.selectedViolationIndex = index;

        this.isEditing = true;
        this.violationsArray[this.selectedViolationIndex].isEditingViolation =
            true;

        this.hideFormOnEdit = true;
        this.displayButtonInsteadOfForm = false;

        const selectedViolation =
            this.violationsArray[this.selectedViolationIndex];

        this.formValuesToPatch = selectedViolation;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.selectedViolationIndex];
        }
    }

    public cancelViolationEditing(_: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;

        if (this.violationsArray.length === 1) {
            const selectedViolation = this.violationsArray[0];

            this.formValuesToPatch = selectedViolation;

            this.violationsArray = [];
        } else {
            if (this.selectedViolationIndex >= 0) {
                this.violationsArray[
                    this.selectedViolationIndex
                ].isEditingViolation = false;
            }

            this.formValuesToPatch = {
                date: null,
                vehicleType: null,
                location: null,
                description: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedViolationIndex = -1;
    }

    public saveEditedViolation(event: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        if (this.selectedViolationIndex >= 0) {
            this.violationsArray[this.selectedViolationIndex] = {
                ...this.violationsArray[this.selectedViolationIndex],
                ...event,
            };
        } else {
            this.violationsArray = [...this.violationsArray, event];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;
        this.displayButtonInsteadOfForm = true;

        this.formValuesToPatch = {
            date: null,
            vehicleType: null,
            location: null,
            description: null,
        };

        this.selectedViolationIndex = -1;
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.isEditing = true;

            this.displayButtonInsteadOfForm = false;
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
        this.lastViolationsCard = {
            ...this.lastViolationsCard,
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
        this.previousFormValuesOnReview.trafficViolationItemReview = {
            isDateValid: !event[0].lineInputs[0],
            isLocationValid: !event[0].lineInputs[2],
            isDescriptionValid: !event[1].lineInputs[0],
        };
    }

    public onGetCardOpenAnnotationArrayValues(event: any): void {
        this.isReviewingCard = false;

        this.violationsArray[this.selectedViolationIndex].isEditingViolation =
            false;

        this.violationsArray[
            this.selectedViolationIndex
        ].trafficViolationItemReview = {
            isDateValid: !event[0].lineInputs[0],
            isLocationValid: !event[0].lineInputs[2],
            isDescriptionValid: !event[1].lineInputs[0],
        };

        const hasInvalidFields = JSON.stringify(
            this.violationsArray[this.selectedViolationIndex]
                .trafficViolationItemReview
        );

        if (hasInvalidFields.includes('false')) {
            if (
                !this.openAnnotationArray[this.selectedViolationIndex]
                    .displayAnnotationTextArea
            ) {
                this.openAnnotationArray[
                    this.selectedViolationIndex
                ].displayAnnotationButton = true;
            }

            this.openAnnotationArray[
                this.selectedViolationIndex
            ].lineInputs[0] = true;

            this.cardsWithIncorrectFields = true;
        } else {
            this.openAnnotationArray[
                this.selectedViolationIndex
            ].displayAnnotationButton = false;

            this.hasIncorrectFields = false;
        }

        this.selectedViolationIndex = -1;

        this.previousFormValuesOnReview.trafficViolationItemReview = {
            ...this.previousFormValuesOnReview.trafficViolationItemReview,
            locationMessage: this.lastViolationsCard.firstRowReview,
            descriptionMessage: this.lastViolationsCard.secondRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public cancelViolationReview(_: any): void {
        this.isReviewingCard = false;

        this.violationsArray[this.selectedViolationIndex].isEditingViolation =
            false;

        this.selectedViolationIndex = -1;

        this.previousFormValuesOnReview.trafficViolationItemReview = {
            ...this.previousFormValuesOnReview.trafficViolationItemReview,
            locationMessage: this.lastViolationsCard.firstRowReview,
            descriptionMessage: this.lastViolationsCard.secondRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.vehicleType = res.truckTypes;
            });
    }

    public incorrectInput(
        event: any,
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

            this.violationsForm
                .get(`cardReview${lineIndex + 1}`)
                .patchValue(null);

            Object.keys(
                this.violationsArray[lineIndex].trafficViolationItemReview
            ).forEach((key) => {
                this.violationsArray[lineIndex].trafficViolationItemReview[
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
        } else {
            if (event) {
                selectedInputsLine.lineInputs[inputIndex] = true;

                if (!selectedInputsLine.displayAnnotationTextArea) {
                    selectedInputsLine.displayAnnotationButton = true;
                    selectedInputsLine.displayAnnotationTextArea = false;
                }
            }

            if (!event) {
                selectedInputsLine.lineInputs[inputIndex] = false;

                const lineInputItems = selectedInputsLine.lineInputs;
                const isAnyInputInLineIncorrect =
                    anyInputInLineIncorrect(lineInputItems);

                if (!isAnyInputInLineIncorrect) {
                    selectedInputsLine.displayAnnotationButton = false;
                    selectedInputsLine.displayAnnotationTextArea = false;
                }
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

    public onCardReview(index: number) {
        if (this.isReviewingCard) {
            return;
        }

        this.selectedViolationIndex = index;

        this.violationsArray[index].isEditingViolation = true;

        this.isReviewingCard = true;

        const selectedViolation = this.violationsArray[index];

        this.formValuesToPatch = selectedViolation;
    }

    public startFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            let incorrectValuesArray = [];

            for (let i = 0; i < this.stepFeedbackValues.length; i++) {
                const filteredTrafficViolationIncorrectValues = Object.keys(
                    this.stepFeedbackValues[i]
                )
                    .filter((item) => item !== 'hasIncorrectValue')
                    .reduce((o, key) => {
                        this.stepFeedbackValues[i][key] === false &&
                            (o[key] = this.stepFeedbackValues[i][key]);

                        return o;
                    }, {});

                const hasIncorrectValues = Object.keys(
                    filteredTrafficViolationIncorrectValues
                ).length;

                if (hasIncorrectValues) {
                    const filteredFieldsWithIncorrectValues = Object.keys(
                        filteredTrafficViolationIncorrectValues
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

                        if (keyName === 'date') {
                            o['date'] = convertDateFromBackend(
                                this.stepValues[i].date
                            );
                        }

                        if (keyName === 'location') {
                            o['location'] = JSON.stringify({
                                location: this.stepValues[i].location.address,
                            });
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
                                        ? this.lastViolationsCard[match]
                                        : this.violationsArray[i][match];

                                if (keyName === 'date') {
                                    o['date'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastViolationsCard?.date
                                            : this.violationsArray[i].date;
                                }

                                if (keyName === 'location') {
                                    o['location'] = JSON.stringify({
                                        location:
                                            i ===
                                            this.stepFeedbackValues.length - 1
                                                ? this.lastViolationsCard
                                                      .location?.address
                                                : this.violationsArray[i]
                                                      .location.address,
                                    });
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
            if (
                this.selectedMode === SelectedMode.APPLICANT ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === 'back-step') {
            this.router.navigate([`/application/${this.applicantId}/4`]);
        }
    }

    public onSubmit(): void {
        if (
            this.notBeenConvictedForm.invalid ||
            this.onlyOneHoldLicenseForm.invalid ||
            this.certifyForm.invalid ||
            this.formStatus === 'INVALID' ||
            this.isEditing ||
            (this.selectedMode === SelectedMode.FEEDBACK &&
                !this.isFeedbackValueUpdated)
        ) {
            if (this.formStatus === 'INVALID') {
                this.markFormInvalid = true;
            }

            if (this.notBeenConvictedForm.invalid) {
                this.inputService.markInvalid(this.notBeenConvictedForm);
            }

            if (this.onlyOneHoldLicenseForm.invalid) {
                this.inputService.markInvalid(this.onlyOneHoldLicenseForm);
            }

            if (this.certifyForm.invalid) {
                this.inputService.markInvalid(this.certifyForm);
            }

            return;
        }

        const { noViolationsForPastTwelveMonths } =
            this.trafficViolationsForm.value;

        const { notBeenConvicted } = this.notBeenConvictedForm.value;

        const { onlyOneHoldLicense } = this.onlyOneHoldLicenseForm.value;

        const { certify } = this.certifyForm.value;

        const filteredViolationsArray = this.violationsArray.map((item) => {
            return {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: item.id ? item.id : null,
                    trafficViolationItemReview: item.trafficViolationItemReview
                        ? {
                              ...item.trafficViolationItemReview,
                              trafficViolationItemId: item.id ? item.id : null,
                          }
                        : null,
                }),
                date: convertDateToBackend(item.date),
                vehicleTypeId: this.vehicleType.find(
                    (vehicleItem) => vehicleItem.name === item.vehicleType
                ).id,
                location: item.location,
                description: item.description,
            };
        });

        let filteredLastViolationsCard: any;

        if (!noViolationsForPastTwelveMonths) {
            filteredLastViolationsCard = {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: this.lastViolationsCard.id
                        ? this.lastViolationsCard.id
                        : null,
                    trafficViolationItemReview: this.lastViolationsCard
                        .trafficViolationItemReview
                        ? {
                              ...this.lastViolationsCard
                                  .trafficViolationItemReview,
                              trafficViolationItemId: this.lastViolationsCard.id
                                  ? this.lastViolationsCard.id
                                  : null,
                          }
                        : null,
                }),
                date: convertDateToBackend(this.lastViolationsCard.date),
                vehicleTypeId: this.vehicleType.find(
                    (vehicleItem) =>
                        vehicleItem.name === this.lastViolationsCard.vehicleType
                ).id,
                location: this.lastViolationsCard.location,
                description: this.lastViolationsCard.description,
            };
        }

        const saveData: CreateTrafficViolationCommand = {
            applicantId: this.applicantId,
            noViolationsForPastTwelveMonths,
            notBeenConvicted: noViolationsForPastTwelveMonths
                ? false
                : notBeenConvicted,
            onlyOneHoldLicense: noViolationsForPastTwelveMonths
                ? false
                : onlyOneHoldLicense,
            certifyViolations: noViolationsForPastTwelveMonths
                ? false
                : certify,
            trafficViolationItems: noViolationsForPastTwelveMonths
                ? []
                : [...filteredViolationsArray, filteredLastViolationsCard],
        };

        const storeTrafficViolationItems = saveData.trafficViolationItems.map(
            (item) => {
                return {
                    ...item,
                    vehicleType: this.vehicleType.find(
                        (vehicleItem) => vehicleItem.id === item.vehicleTypeId
                    ),
                };
            }
        );

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createTrafficViolations(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateTrafficViolations(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/6`,
                    ]);

                    this.applicantStore.update((store) => {
                        const noViolations =
                            saveData.noViolationsForPastTwelveMonths;

                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                trafficViolation: {
                                    ...store.applicant.trafficViolation,
                                    noViolationsForPastTwelveMonths:
                                        noViolations,
                                    notBeenConvicted: noViolations
                                        ? false
                                        : saveData.notBeenConvicted,
                                    onlyOneHoldLicense: noViolations
                                        ? false
                                        : saveData.onlyOneHoldLicense,
                                    certifyViolations: noViolations
                                        ? false
                                        : saveData.certifyViolations,
                                    trafficViolationItems: noViolations
                                        ? []
                                        : storeTrafficViolationItems,
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
        const violationsArrayReview = this.violationsArray.map(
            (item, index) => {
                const itemReview = item.trafficViolationItemReview;

                return {
                    ...(this.stepHasReviewValues && {
                        id: item.reviewId,
                    }),
                    trafficViolationItemId: item.id,
                    isPrimary: false,
                    commonMessage: this.violationsForm.get(
                        `cardReview${index + 1}`
                    ).value,
                    isDateValid: itemReview ? itemReview.isDateValid : true,
                    isLocationValid: itemReview
                        ? itemReview.isLocationValid
                        : true,
                    locationMessage: null,
                    isDescriptionValid: itemReview
                        ? itemReview.isDescriptionValid
                        : true,
                    descriptionMessage: null,
                };
            }
        );

        const lastItemReview =
            this.previousFormValuesOnReview.trafficViolationItemReview;

        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;

        const lastReviewedItemIViolationsArray = {
            ...(this.stepHasReviewValues && {
                id: lastItemReviewId,
            }),
            trafficViolationItemId: lastItemId,
            isPrimary: true,
            commonMessage: null,
            isDateValid: lastItemReview.isDateValid ?? true,
            isLocationValid: lastItemReview.isLocationValid ?? true,
            locationMessage: this.lastViolationsCard.firstRowReview,
            isDescriptionValid: lastItemReview.isDescriptionValid ?? true,
            descriptionMessage: this.lastViolationsCard.secondRowReview,
        };

        const saveData: CreateTrafficViolationReviewCommand = {
            applicantId: this.applicantId,
            trafficViolationReviews: [
                ...violationsArrayReview,
                lastReviewedItemIViolationsArray,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createTrafficViolationsReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateTrafficViolationsReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/6`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                trafficViolation: {
                                    ...store.applicant.trafficViolation,
                                    trafficViolationItems:
                                        store.applicant.trafficViolation.trafficViolationItems.map(
                                            (item, index) => {
                                                if (
                                                    index ===
                                                    store.applicant
                                                        .trafficViolation
                                                        .trafficViolationItems
                                                        .length -
                                                        1
                                                ) {
                                                    return {
                                                        ...item,
                                                        trafficViolationItemReview:
                                                            {
                                                                ...item.trafficViolationItemReview,
                                                                isDateValid:
                                                                    lastReviewedItemIViolationsArray.isDateValid,
                                                                isLocationValid:
                                                                    lastReviewedItemIViolationsArray.isLocationValid,
                                                                locationMessage:
                                                                    lastReviewedItemIViolationsArray.locationMessage,
                                                                isDescriptionValid:
                                                                    lastReviewedItemIViolationsArray.isDescriptionValid,
                                                                descriptionMessage:
                                                                    lastReviewedItemIViolationsArray.descriptionMessage,
                                                            },
                                                    };
                                                }

                                                return {
                                                    ...item,
                                                    trafficViolationItemReview:
                                                        {
                                                            ...item.trafficViolationItemReview,
                                                            ...violationsArrayReview[
                                                                index
                                                            ],
                                                        },
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
