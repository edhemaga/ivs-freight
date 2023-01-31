/* eslint-disable no-unused-vars */

import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

import {
    anyInputInLineIncorrect,
    isAnyValueInArrayFalse,
    isEveryValueInArrayTrue,
    isFormValueNotEqual,
} from '../../state/utils/utils';

import {
    convertDateFromBackend,
    convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { LicenseModel } from '../../state/model/cdl-information';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import {
    ApplicantModalResponse,
    ApplicantResponse,
    CdlEndorsementResponse,
    CdlFeedbackResponse,
    CdlRestrictionResponse,
    CountryType,
    CreateApplicantCdlInformationReviewCommand,
    EnumValue,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step3',
    templateUrl: './step3.component.html',
    styleUrls: ['./step3.component.scss'],
})
export class Step3Component implements OnInit, OnDestroy, AfterContentChecked {
    @ViewChildren('cmp') set content(content: QueryList<any>) {
        if (content) {
            const radioButtonsArray = content.toArray();

            this.permitRadios = radioButtonsArray[0]
                ? radioButtonsArray[0].buttons
                : null;
        }
    }

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public subscription: Subscription;

    public permitForm: UntypedFormGroup;
    public licenseForm: UntypedFormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public licenseArray: LicenseModel[] = [];

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public lastLicenseCard: any;

    public applicantId: number;

    public selectedLicenseIndex: number = -1;

    public isEditing: boolean = false;
    public isReviewingCard: boolean = false;

    public displayButtonInsteadOfForm: boolean = false;
    public hideFormOnEdit: boolean = false;

    public formValuesToPatch: any;

    public canadaStates: any[] = [];
    public usStates: any[] = [];

    public countryTypes: EnumValue[] = [];
    public stateTypes: any[] = [];
    public classTypes: EnumValue[] = [];
    public restrictionsList: CdlRestrictionResponse[] = [];
    public endorsmentsList: CdlEndorsementResponse[] = [];

    public permitRadios: any;

    public displayRadioRequiredNote = false;

    public answerChoices: AnswerChoices[] = [
        {
            id: 1,
            label: 'YES',
            value: 'permitYes',
            name: 'permitYes',
            checked: false,
        },
        {
            id: 2,
            label: 'NO',
            value: 'permitNo',
            name: 'permitNo',
            checked: false,
        },
    ];

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {
            lineIndex: 14,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public questionsHaveIncorrectFields: boolean = false;
    public hasIncorrectFields: boolean = false;
    public cardsWithIncorrectFields: boolean = false;
    public previousFormValuesOnReview: any;

    public stepFeedbackValues: any;
    public feedbackValuesToPatch: any;
    public isUpperFormFeedbackValueUpdated: boolean = false;
    public isBottomFormFeedbackValueUpdated: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
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
    }

    ngAfterContentChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.licenseForm = this.formBuilder.group({
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

        this.permitForm = this.formBuilder.group({
            permit: [null, Validators.required],
            permitExplain: [null],
            fifthRowReview: [null],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.cdlInformation) {
                    this.patchStepValues(res.cdlInformation);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: CdlFeedbackResponse): void {
        const {
            cdlDenied,
            cdlDeniedExplanation,
            cdlInformationReview,
            licences,
        } = stepValues;

        const lastItemInLicenseArray = licences[licences.length - 1];

        const restOfTheItemsInLicenseArray = [...licences];

        const filteredLicenseArray = restOfTheItemsInLicenseArray.map(
            (item) => {
                return {
                    id: item.id,
                    reviewId: item.licenseReview?.id,
                    isEditingLicense: false,
                    licenseNumber: item.licenseNumber,
                    country: item.country.name,
                    state: item.state.stateName,
                    stateShort: item.state.stateShortName,
                    classType: item.classType.name,
                    expDate: convertDateFromBackend(item.expDate).replace(
                        /-/g,
                        '/'
                    ),
                    restrictions: item.cdlRestrictions,
                    endorsments: item.cdlEndorsements,
                    restrictionsCode: item.cdlRestrictions
                        .map((resItem) => resItem.code)
                        .join(', '),
                    endorsmentsCode: item.cdlEndorsements
                        .map((resItem) => resItem.code)
                        .join(', '),
                    licenseReview: item.licenseReview
                        ? item.licenseReview
                        : null,
                };
            }
        );

        const filteredLastItemInLicenseArray = {
            id: lastItemInLicenseArray.id,
            reviewId: lastItemInLicenseArray.licenseReview?.id,
            isEditingLicense: false,
            licenseNumber: lastItemInLicenseArray.licenseNumber,
            country: lastItemInLicenseArray.country.name,
            state: lastItemInLicenseArray.state.stateName,
            stateShort: lastItemInLicenseArray.state.stateShortName,
            classType: lastItemInLicenseArray.classType.name,
            expDate: convertDateFromBackend(
                lastItemInLicenseArray.expDate
            ).replace(/-/g, '/'),
            restrictions: lastItemInLicenseArray.cdlRestrictions,
            endorsments: lastItemInLicenseArray.cdlEndorsements,
            restrictionsCode: lastItemInLicenseArray.cdlRestrictions
                .map((resItem) => resItem.code)
                .join(', '),
            endorsmentsCode: lastItemInLicenseArray.cdlEndorsements
                .map((resItem) => resItem.code)
                .join(', '),
            licenseReview: lastItemInLicenseArray.licenseReview
                ? lastItemInLicenseArray.licenseReview
                : null,
        };

        this.lastLicenseCard = {
            ...filteredLastItemInLicenseArray,
        };

        this.licenseArray = JSON.parse(JSON.stringify(filteredLicenseArray));

        this.previousFormValuesOnReview = filteredLastItemInLicenseArray;

        this.formStatus = 'VALID';

        this.displayButtonInsteadOfForm = true;

        this.permitForm.patchValue({
            permit: cdlDenied,
            permitExplain: cdlDeniedExplanation,
        });

        setTimeout(() => {
            const permitValue = this.permitForm.get('permit').value;

            if (permitValue) {
                this.permitRadios[0].checked = true;

                this.inputService.changeValidators(
                    this.permitForm.get('permitExplain')
                );
            } else {
                this.permitRadios[1].checked = true;

                this.inputService.changeValidators(
                    this.permitForm.get('permitExplain'),
                    false
                );
            }
        }, 50);

        if (this.selectedMode === SelectedMode.REVIEW) {
            if (stepValues.cdlInformationReview) {
                const {
                    isCdlDeniedExplanationValid,
                    cdlDeniedExplanationMessage,
                } = stepValues.cdlInformationReview;

                this.stepHasReviewValues = true;

                this.openAnnotationArray[14] = {
                    ...this.openAnnotationArray[14],
                    lineInputs: [!isCdlDeniedExplanationValid],
                    displayAnnotationButton:
                        !isCdlDeniedExplanationValid &&
                        !cdlDeniedExplanationMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: cdlDeniedExplanationMessage
                        ? true
                        : false,
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.questionsHaveIncorrectFields = true;
                } else {
                    this.questionsHaveIncorrectFields = false;
                }

                this.permitForm.patchValue({
                    fifthRowReview: cdlDeniedExplanationMessage,
                });
            }

            const licenseItemsReview = licences.map(
                (item) => item.licenseReview
            );

            if (licenseItemsReview[0]) {
                this.stepHasReviewValues = true;

                licenseItemsReview.pop();

                for (let i = 0; i < licenseItemsReview.length; i++) {
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

                    const licenseItemReview: any = {
                        ...licenseItemsReview[i],
                    };

                    delete licenseItemReview.isPrimary;

                    let hasIncorrectValue: boolean =
                        Object.values(licenseItemReview).includes(false);

                    const incorrectMessage = licenseItemReview?.commonMessage;

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

                    this.licenseForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage ? incorrectMessage : null);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (cdlInformationReview) {
                this.stepFeedbackValues = {
                    ...this.stepFeedbackValues,
                    ...cdlInformationReview,
                };
            }

            const licenseItemsReview = licences.map(
                (item) => item.licenseReview
            );

            this.stepFeedbackValues = {
                ...this.stepFeedbackValues,
                licenseItemsReview: licenseItemsReview.map((item) => {
                    return {
                        isLicenseValid: item.isLicenseValid,
                        licenseMessage: item.licenseMessage,
                        isExpDateValid: item.isExpDateValid,
                        expDateMessage: item.expDateMessage,
                        commonMessage: item.commonMessage,
                        hasIncorrectValue: isAnyValueInArrayFalse([
                            item.isLicenseValid,
                            item.isExpDateValid,
                        ]),
                    };
                }),
            };

            const hasIncorrectValue =
                !this.stepFeedbackValues.isCdlDeniedExplanationValid;

            if (hasIncorrectValue) {
                this.startBottomFormFeedbackValueChangesMonitoring();
            } else {
                this.isBottomFormFeedbackValueUpdated = true;
            }

            this.stepValues = stepValues;

            this.feedbackValuesToPatch =
                this.stepFeedbackValues.licenseItemsReview[
                    this.stepFeedbackValues?.licenseItemsReview.length - 1
                ];
        }
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.PERMIT:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                if (selectedCheckbox.label === 'YES') {
                    this.permitForm.get('permit').patchValue(true);

                    this.inputService.changeValidators(
                        this.permitForm.get('permitExplain')
                    );
                } else {
                    this.permitForm.get('permit').patchValue(false);

                    this.inputService.changeValidators(
                        this.permitForm.get('permitExplain'),
                        false
                    );
                }

                this.displayRadioRequiredNote = false;

                break;
            default:
                break;
        }
    }

    public onDeleteLicense(index: number): void {
        if (this.isEditing) {
            return;
        }

        this.licenseArray.splice(index, 1);
    }

    public getLicenseFormValues(event: any): void {
        this.licenseArray = [...this.licenseArray, event];

        this.isEditing = true;

        this.formValuesToPatch = {
            licenseNumber: null,
            country: null,
            state: null,
            classType: null,
            expDate: null,
            restrictions: null,
            endorsments: null,
        };

        if (this.lastLicenseCard.id) {
            this.licenseArray[this.licenseArray.length - 1].id =
                this.lastLicenseCard.id;

            this.lastLicenseCard.id = null;
        } else {
            this.licenseArray[this.licenseArray.length - 1].id = null;
        }
    }

    public onEditLicense(index: number): void {
        this.licenseArray
            .filter((item) => item.isEditingLicense)
            .forEach((item) => (item.isEditingLicense = false));

        this.selectedLicenseIndex = index;

        this.isEditing = true;
        this.licenseArray[this.selectedLicenseIndex].isEditingLicense = true;

        this.hideFormOnEdit = true;
        this.displayButtonInsteadOfForm = false;

        const selectedLicence = this.licenseArray[this.selectedLicenseIndex];

        this.formValuesToPatch = selectedLicence;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.selectedLicenseIndex];
        }
    }

    public cancelLicenseEditing(_: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;

        if (this.licenseArray.length === 1) {
            const selectedLicence = this.licenseArray[0];

            this.formValuesToPatch = selectedLicence;

            this.licenseArray = [];
        } else {
            if (this.selectedLicenseIndex >= 0) {
                this.licenseArray[this.selectedLicenseIndex].isEditingLicense =
                    false;
            }

            this.formValuesToPatch = {
                licenseNumber: null,
                country: null,
                state: null,
                classType: null,
                expDate: null,
                restrictions: null,
                endorsments: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedLicenseIndex = -1;
    }

    public saveEditedLicense(event: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        if (this.selectedLicenseIndex >= 0) {
            this.licenseArray[this.selectedLicenseIndex] = {
                ...this.licenseArray[this.selectedLicenseIndex],
                ...event,
            };
        } else {
            this.licenseArray = [...this.licenseArray, event];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;
        this.displayButtonInsteadOfForm = true;

        this.formValuesToPatch = {
            licenseNumber: null,
            country: null,
            state: null,
            classType: null,
            expDate: null,
            restrictions: null,
            endorsments: null,
        };

        this.selectedLicenseIndex = -1;
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.isEditing = true;

            this.displayButtonInsteadOfForm = false;

            this.formValuesToPatch = {
                licenseNumber: null,
                country: null,
                state: null,
                classType: null,
                expDate: null,
                restrictions: null,
                endorsments: null,
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
        this.lastLicenseCard = {
            ...this.lastLicenseCard,
            ...event,
        };

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (event) {
                this.startUpperFormFeedbackValueChangesMonitoring();
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
        this.previousFormValuesOnReview.licenseReview = {
            isLicenseValid: !event[0].lineInputs[0],
            isExpDateValid: !event[1].lineInputs[2],
        };
    }

    public onGetCardOpenAnnotationArrayValues(event: any): void {
        this.isReviewingCard = false;

        this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

        this.licenseArray[this.selectedLicenseIndex].licenseReview = {
            isLicenseValid: !event[0].lineInputs[0],
            isExpDateValid: !event[1].lineInputs[2],
        };

        const hasInvalidFields = JSON.stringify(
            this.licenseArray[this.selectedLicenseIndex].licenseReview
        );

        if (hasInvalidFields.includes('false')) {
            if (
                !this.openAnnotationArray[this.selectedLicenseIndex]
                    .displayAnnotationTextArea
            ) {
                this.openAnnotationArray[
                    this.selectedLicenseIndex
                ].displayAnnotationButton = true;
            }

            this.openAnnotationArray[this.selectedLicenseIndex].lineInputs[0] =
                true;

            this.cardsWithIncorrectFields = true;
        } else {
            this.openAnnotationArray[
                this.selectedLicenseIndex
            ].displayAnnotationButton = false;

            this.hasIncorrectFields = false;
        }

        this.selectedLicenseIndex = -1;

        this.previousFormValuesOnReview.licenseReview = {
            ...this.previousFormValuesOnReview.licenseReview,
            licenseMessage: this.lastLicenseCard.firstRowReview,
            expDateMessage: this.lastLicenseCard.secondRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public cancelLicenseReview(_: any): void {
        this.isReviewingCard = false;

        this.licenseArray[this.selectedLicenseIndex].isEditingLicense = false;

        this.selectedLicenseIndex = -1;

        this.previousFormValuesOnReview.licenseReview = {
            ...this.previousFormValuesOnReview.licenseReview,
            licenseMessage: this.lastLicenseCard.firstRowReview,
            expDateMessage: this.lastLicenseCard.secondRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.countryTypes = res.countryTypes;

                this.usStates = res.usStates.map((item) => {
                    return {
                        id: item.id,
                        name: item.stateShortName,
                        stateName: item.stateName,
                    };
                });

                this.canadaStates = res.canadaStates.map((item) => {
                    return {
                        id: item.id,
                        name: item.stateShortName,
                        stateName: item.stateName,
                    };
                });

                this.classTypes = res.classTypes;

                this.restrictionsList = res.restrictions;
                this.endorsmentsList = res.endorsements;
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

            this.licenseForm.get(`cardReview${lineIndex + 1}`).patchValue(null);

            Object.keys(this.licenseArray[lineIndex].licenseReview).forEach(
                (key) => {
                    this.licenseArray[lineIndex].licenseReview[key] = true;
                }
            );

            const inputFieldsArray = JSON.stringify(
                this.openAnnotationArray
                    .filter(
                        (_, index) =>
                            index !== this.openAnnotationArray.length - 1
                    )
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

                if (lineIndex === 14) {
                    this.permitForm.get('fifthRowReview').patchValue(null);
                }
            }
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray
                .filter((item) => Object.keys(item).length !== 0)
                .map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.questionsHaveIncorrectFields = true;
        } else {
            this.questionsHaveIncorrectFields = false;
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

        this.selectedLicenseIndex = index;

        this.licenseArray[index].isEditingLicense = true;

        this.isReviewingCard = true;

        const selectedLicense = this.licenseArray[index];

        this.formValuesToPatch = selectedLicense;
    }

    public startUpperFormFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            let incorrectValuesArray = [];

            for (
                let i = 0;
                i < this.stepFeedbackValues.licenseItemsReview.length;
                i++
            ) {
                const filteredLicenseIncorrectValues = Object.keys(
                    this.stepFeedbackValues?.licenseItemsReview[i]
                )
                    .filter((item) => item !== 'hasIncorrectValue')
                    .reduce((o, key) => {
                        this.stepFeedbackValues.licenseItemsReview[i][key] ===
                            false &&
                            (o[key] =
                                this.stepFeedbackValues?.licenseItemsReview[i][
                                    key
                                ]);

                        return o;
                    }, {});

                const hasIncorrectValues = Object.keys(
                    filteredLicenseIncorrectValues
                ).length;

                if (hasIncorrectValues) {
                    const filteredFieldsWithIncorrectValues = Object.keys(
                        filteredLicenseIncorrectValues
                    ).reduce((o, key) => {
                        const keyName = key
                            .replace('Valid', '')
                            .replace('is', '')
                            .trim()
                            .toLowerCase();

                        if (keyName === 'expdate') {
                            o['expdate'] = convertDateFromBackend(
                                this.stepValues.licences[i].expDate
                            );
                        }

                        if (keyName === 'license') {
                            o['licensenumber'] =
                                this.stepValues.licences[i].licenseNumber;
                        }

                        return o;
                    }, {});

                    const filteredUpdatedFieldsWithIncorrectValues =
                        Object.keys(filteredFieldsWithIncorrectValues).reduce(
                            (o, key) => {
                                const keyName = key;

                                if (keyName === 'expdate') {
                                    o['expdate'] =
                                        i ===
                                        this.stepFeedbackValues
                                            .licenseItemsReview.length -
                                            1
                                            ? this.lastLicenseCard?.expDate
                                            : this.licenseArray[i].expDate;
                                }

                                if (keyName === 'licensenumber') {
                                    o['licensenumber'] =
                                        i ===
                                        this.stepFeedbackValues
                                            .licenseItemsReview.length -
                                            1
                                            ? this.lastLicenseCard
                                                  ?.licenseNumber
                                            : this.licenseArray[i]
                                                  .licenseNumber;
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
                this.isUpperFormFeedbackValueUpdated = true;
            } else {
                this.isUpperFormFeedbackValueUpdated = false;
            }
        }
    }

    public startBottomFormFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            this.subscription = this.permitForm
                .get('permitExplain')
                .valueChanges.pipe(takeUntil(this.destroy$))
                .subscribe((updatedValue) => {
                    const previousValue = this.stepValues.cdlDeniedExplanation;

                    if (previousValue !== updatedValue) {
                        this.isBottomFormFeedbackValueUpdated = true;
                    } else {
                        this.isBottomFormFeedbackValueUpdated = false;
                    }
                });
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
            this.router.navigate([`/application/${this.applicantId}/2`]);
        }
    }

    public onSubmit(): void {
        const { permit, permitExplain } = this.permitForm.value;

        if (
            this.permitForm.invalid ||
            this.formStatus === 'INVALID' ||
            permit === null ||
            this.isEditing ||
            (this.selectedMode === SelectedMode.FEEDBACK &&
                (!this.isUpperFormFeedbackValueUpdated ||
                    !this.isBottomFormFeedbackValueUpdated))
        ) {
            if (this.permitForm.invalid) {
                this.inputService.markInvalid(this.permitForm);
            }

            if (this.formStatus === 'INVALID') {
                this.markFormInvalid = true;
            }

            if (permit === null) {
                this.displayRadioRequiredNote = true;
            }

            return;
        }

        const filteredLicenseArray = this.licenseArray.map((item) => {
            const filteredStateType = this.usStates.find(
                (stateItem) => stateItem.name === item.stateShort
            );

            const stateId = filteredStateType
                ? filteredStateType.id
                : this.canadaStates.find(
                      (stateItem) => stateItem.name === item.stateShort
                  ).id;

            return {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: item.id ? item.id : null,
                    licenseReview: item.licenseReview
                        ? {
                              ...item.licenseReview,
                              applicantCdlId: item.id ? item.id : null,
                          }
                        : null,
                }),
                licenseNumber: item.licenseNumber,
                country: item.country as CountryType,
                stateId,
                classType: item.classType,
                expDate: convertDateToBackend(item.expDate),
                restrictions: item.restrictions.map((item) => item.id),
                endorsements: item.endorsments.map((item) => item.id),
            };
        });

        let filteredLastLicenseCard: any;

        if (!this.licenseArray.length) {
            const filteredStateType = this.usStates.find(
                (stateItem) =>
                    stateItem.name === this.lastLicenseCard.stateShort
            );

            const filteredLastLicenseCardStateId = filteredStateType
                ? filteredStateType.id
                : this.canadaStates.find(
                      (stateItem) =>
                          stateItem.name === this.lastLicenseCard.stateShort
                  ).id;

            filteredLastLicenseCard = {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: this.lastLicenseCard.id
                        ? this.lastLicenseCard.id
                        : null,
                    licenseReview: this.lastLicenseCard.licenseReview
                        ? {
                              ...this.lastLicenseCard.licenseReview,
                              applicantCdlId: this.lastLicenseCard.id
                                  ? this.lastLicenseCard.id
                                  : null,
                          }
                        : null,
                }),
                licenseNumber: this.lastLicenseCard.licenseNumber,
                country: this.lastLicenseCard.country,
                stateId: filteredLastLicenseCardStateId,
                classType: this.lastLicenseCard.classType,
                expDate: convertDateToBackend(this.lastLicenseCard.expDate),
                restrictions: this.lastLicenseCard.restrictions.map(
                    (item) => item.id
                ),
                endorsements: this.lastLicenseCard.endorsments.map(
                    (item) => item.id
                ),
            };
        }

        const saveData: any = {
            applicantId: this.applicantId,
            cdlDenied: permit,
            cdlDeniedExplanation: permitExplain,
            licences: !this.licenseArray.length
                ? [filteredLastLicenseCard]
                : [...filteredLicenseArray],
        };

        const storeLicenceItems = saveData.licences.map((item) => {
            const filteredUsStateType = this.usStates.find(
                (stateItem) => stateItem.id === item.stateId
            );

            const filteredStateType = filteredUsStateType
                ? filteredUsStateType
                : this.canadaStates.find(
                      (stateItem) => stateItem.id === item.stateId
                  );

            return {
                ...item,
                country: this.countryTypes.find(
                    (countryItem) => countryItem.name === item.country
                ),
                state: {
                    countryType: this.countryTypes.find(
                        (countryItem) => countryItem.name === item.country
                    ),
                    id: filteredStateType.id,
                    stateName: filteredStateType.stateName,
                    stateShortName: filteredStateType.name,
                },
                classType: this.classTypes.find(
                    (classItem) => classItem.name === item.classType
                ),
                expDate: item.expDate,
                cdlRestrictions: this.restrictionsList.filter((resItem) =>
                    item.restrictions.includes(resItem.id)
                ),
                cdlEndorsements: this.endorsmentsList.filter((endItem) =>
                    item.endorsements.includes(endItem.id)
                ),
            };
        });

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createCdlInformation(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateCdlInformation(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/4`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                cdlInformation: {
                                    ...store.applicant.cdlInformation,
                                    cdlDenied: saveData.cdlDenied,
                                    cdlDeniedExplanation:
                                        saveData.cdlDeniedExplanation,
                                    licences: storeLicenceItems,
                                },
                            },
                        };
                    });

                    if (this.selectedMode === SelectedMode.FEEDBACK) {
                        if (this.subscription) {
                            this.subscription.unsubscribe();
                        }
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onSubmitReview(): void {
        const licenseArrayReview = this.licenseArray.map((item, index) => {
            const itemReview = item.licenseReview;

            return {
                ...(this.stepHasReviewValues && {
                    id: item.reviewId,
                }),
                applicantCdlId: item.id,
                isPrimary: false,
                commonMessage: this.licenseForm.get(`cardReview${index + 1}`)
                    .value,
                isLicenseValid: itemReview ? itemReview.isLicenseValid : true,
                licenseMessage: null,
                isExpDateValid: itemReview ? itemReview.isExpDateValid : true,
                expDateMessage: null,
            };
        });

        const lastItemReview = this.previousFormValuesOnReview.licenseReview;

        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;

        const lastReviewedItemInLicenseArray = {
            ...(this.stepHasReviewValues && {
                id: lastItemReviewId,
            }),
            applicantCdlId: lastItemId,
            isPrimary: true,
            commonMessage: null,
            isLicenseValid: lastItemReview.isLicenseValid ?? true,
            licenseMessage: this.lastLicenseCard.firstRowReview,
            isExpDateValid: lastItemReview.isExpDateValid ?? true,
            expDateMessage: this.lastLicenseCard.secondRowReview,
        };

        const saveData: CreateApplicantCdlInformationReviewCommand = {
            applicantId: this.applicantId,
            isCdlDeniedExplanationValid:
                !this.openAnnotationArray[14].lineInputs[0],
            cdlDeniedExplanationMessage:
                this.permitForm.get('fifthRowReview').value,
            licenceReviews: [
                ...licenseArrayReview,
                lastReviewedItemInLicenseArray,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createCdlInformationReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateCdlInformationReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/4`,
                    ]);

                    const { licenceReviews, ...stepValuesReview } = saveData;

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                cdlInformation: {
                                    ...store.applicant.cdlInformation,
                                    cdlInformationReview: {
                                        ...store.applicant.education
                                            .cdlInformationReview,
                                        ...stepValuesReview,
                                    },
                                    licences:
                                        store.applicant.cdlInformation.licences.map(
                                            (item, index) => {
                                                if (
                                                    index ===
                                                    store.applicant
                                                        .cdlInformation.licences
                                                        .length -
                                                        1
                                                ) {
                                                    return {
                                                        ...item,
                                                        licenseReview: {
                                                            ...item.licenseReview,
                                                            isLicenseValid:
                                                                lastReviewedItemInLicenseArray.isLicenseValid,
                                                            licenseMessage:
                                                                lastReviewedItemInLicenseArray.licenseMessage,
                                                            isExpDateValid:
                                                                lastReviewedItemInLicenseArray.isExpDateValid,
                                                            expDateMessage:
                                                                lastReviewedItemInLicenseArray.expDateMessage,
                                                        },
                                                    };
                                                }

                                                return {
                                                    ...item,
                                                    licenseReview: {
                                                        ...item.licenseReview,
                                                        ...licenseArrayReview[
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

    ngOnDestroy(): void {}
}
