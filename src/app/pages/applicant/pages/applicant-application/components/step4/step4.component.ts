import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// helpers
import {
    anyInputInLineIncorrect,
    isAnyValueInArrayFalse,
    isEveryValueInArrayTrue,
    isFormValueNotEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

// models
import { Accident } from '@pages/applicant/pages/applicant-application/models/accident.model';
import {
    AccidentRecordFeedbackResponse,
    ApplicantModalResponse,
    ApplicantResponse,
    CreateAccidentRecordCommand,
    CreateAccidentRecordReviewCommand,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { Step4FormComponent } from '@pages/applicant/components/applicant-forms/step4-form/step4-form.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-step4',
    templateUrl: './step4.component.html',
    styleUrls: ['./step4.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaCheckboxComponent,
        Step4FormComponent,
        ApplicantAddSaveBtnComponent,
        TaAppTooltipV2Component,
        ApplicantNextBackBtnComponent
    ],
})
export class Step4Component implements OnInit, OnDestroy, AfterContentChecked {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public accidentForm: UntypedFormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public accidentArray: Accident[] = [];

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public lastAccidentCard: any;

    public vehicleType: TruckTypeResponse[] = [];

    public applicantId: number;

    public selectedAccidentIndex: number = -1;

    public displayRadioRequiredNote: boolean = false;
    public checkIsHazmatSpillNotChecked: boolean = false;

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

        this.hasNoAccidents();
    }

    ngAfterContentChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    public trackByIdentity = (index: number, _): number => index;

    public createForm(): void {
        this.accidentForm = this.formBuilder.group({
            hasPastAccident: [false],

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

                if (res.accidentRecords) {
                    this.patchStepValues(res.accidentRecords);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: AccidentRecordFeedbackResponse): void {
        const { noAccidentInThreeYears, accidents } = stepValues;

        this.accidentForm
            .get('hasPastAccident')
            .patchValue(noAccidentInThreeYears);

        this.formStatus = 'VALID';

        if (!noAccidentInThreeYears) {
            const lastItemInAccidentArray = accidents[accidents.length - 1];

            const restOfTheItemsInAccidenteArray = [...accidents];

            const filteredAccidentArray = restOfTheItemsInAccidenteArray.map(
                (item) => {
                    return {
                        id: item.id,
                        reviewId: item.accidentItemReview?.id,
                        isEditingAccident: false,
                        location: item.location,
                        date: MethodsCalculationsHelper.convertDateFromBackend(
                            item.date
                        ).replace(/-/g, '/'),
                        hazmatSpill: item.hazmatSpill,
                        fatalities: item.fatalities.toString(),
                        injuries: item.injuries.toString(),
                        collisions: item.collisions.toString(),
                        vehicleType: item.vehicleType.name,
                        vehicleTypeLogoName: item.vehicleType.logoName,
                        description: item.description,
                        accidentItemReview: item.accidentItemReview
                            ? item.accidentItemReview
                            : null,
                    };
                }
            );

            const filteredLastItemInAccidentArray = {
                id: lastItemInAccidentArray.id,
                reviewId: lastItemInAccidentArray.accidentItemReview?.id,
                isEditingAccident: false,
                location: lastItemInAccidentArray.location,
                date: MethodsCalculationsHelper.convertDateFromBackend(
                    lastItemInAccidentArray.date
                ).replace(/-/g, '/'),
                hazmatSpill: lastItemInAccidentArray.hazmatSpill,
                fatalities: lastItemInAccidentArray.fatalities.toString(),
                collisions: lastItemInAccidentArray.collisions.toString(),
                injuries: lastItemInAccidentArray.injuries.toString(),
                vehicleType: lastItemInAccidentArray.vehicleType.name,
                vehicleTypeLogoName:
                    lastItemInAccidentArray.vehicleType.logoName,
                description: lastItemInAccidentArray.description,
                accidentItemReview: lastItemInAccidentArray.accidentItemReview
                    ? lastItemInAccidentArray.accidentItemReview
                    : null,
            };

            this.lastAccidentCard = {
                ...filteredLastItemInAccidentArray,
            };

            this.accidentArray = JSON.parse(
                JSON.stringify(filteredAccidentArray)
            );

            this.previousFormValuesOnReview = filteredLastItemInAccidentArray;

            this.formStatus = 'VALID';

            this.displayButtonInsteadOfForm = true;
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            const accidentItemsReview = accidents.map(
                (item) => item.accidentItemReview
            );

            if (accidentItemsReview[0]) {
                this.stepHasReviewValues = true;

                accidentItemsReview.pop();

                for (let i = 0; i < accidentItemsReview.length; i++) {
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

                    const accidentItemReview = {
                        ...accidentItemsReview[i],
                    };

                    delete accidentItemReview.isPrimary;

                    let hasIncorrectValue: boolean;

                    if (accidentItemsReview[0]) {
                        hasIncorrectValue =
                            Object.values(accidentItemReview).includes(false);
                    }

                    const incorrectMessage = accidentItemReview?.commonMessage;

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

                    this.accidentForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage ? incorrectMessage : null);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            const accidentRecordItemsReview = accidents.map(
                (item) => item.accidentItemReview
            );

            this.stepFeedbackValues = accidentRecordItemsReview.map((item) => {
                return {
                    isLocationValid: item.isLocationValid,
                    isDateValid: item.isDateValid,
                    locationDateMessage: item.locationDateMessage,
                    isDescriptionValid: item.isDescriptionValid,
                    descriptionMessage: item.descriptionMessage,
                    commonMessage: item.commonMessage,
                    hasIncorrectValue: isAnyValueInArrayFalse([
                        item.isLocationValid,
                        item.isDateValid,
                        item.isDescriptionValid,
                    ]),
                };
            });

            this.stepValues = stepValues.accidents;

            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues?.length - 1];
        }
    }

    private hasNoAccidents(): void {
        this.accidentForm
            .get('hasPastAccident')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.formStatus = 'VALID';
                } else {
                    if (this.lastAccidentCard) {
                        this.formValuesToPatch = {
                            location: this.lastAccidentCard?.location,
                            date: this.lastAccidentCard?.date,
                            hazmatSpill: this.lastAccidentCard?.hazmatSpill,
                            fatalities: this.lastAccidentCard?.fatalities,
                            collisions: this.lastAccidentCard?.collisions,
                            injuries: this.lastAccidentCard?.injuries,
                            vehicleType: this.lastAccidentCard?.vehicleType,
                            description: this.lastAccidentCard?.description,
                        };
                    }

                    this.formStatus = 'INVALID';
                }
            });
    }

    public onDeleteAccident(): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;

        if (this.accidentArray.length === 1) {
            const selectedAccident = this.accidentArray[0];

            this.formValuesToPatch = selectedAccident;

            this.accidentArray = [];
        } else {
            if (this.selectedAccidentIndex >= 0) {
                this.accidentArray[
                    this.selectedAccidentIndex
                ].isEditingAccident = false;
                this.accidentArray.splice(this.selectedAccidentIndex, 1);
            }

            this.formValuesToPatch = {
                location: null,
                date: null,
                hazmatSpill: null,
                collisions: null,
                fatalities: null,
                injuries: null,
                vehicleType: null,
                description: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedAccidentIndex = -1;
    }

    public getAccidentFormValues(event: any): void {
        this.accidentArray = [...this.accidentArray, event];

        this.isEditing = true;

        this.formValuesToPatch = {
            location: null,
            date: null,
            hazmatSpill: null,
            collisions: null,
            fatalities: null,
            injuries: null,
            vehicleType: null,
            description: null,
        };

        if (this.lastAccidentCard.id) {
            this.accidentArray[this.accidentArray.length - 1].id =
                this.lastAccidentCard.id;

            this.lastAccidentCard.id = null;
        } else {
            this.accidentArray[this.accidentArray.length - 1].id = null;
        }
    }

    public onEditAccident(index: number): void {
        this.accidentArray
            .filter((item) => item.isEditingAccident)
            .forEach((item) => (item.isEditingAccident = false));

        this.selectedAccidentIndex = index;

        this.isEditing = true;
        this.accidentArray[this.selectedAccidentIndex].isEditingAccident = true;

        this.hideFormOnEdit = true;
        this.displayButtonInsteadOfForm = false;

        const selectedAccident = this.accidentArray[this.selectedAccidentIndex];

        this.formValuesToPatch = selectedAccident;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.selectedAccidentIndex];
        }
    }

    public cancelAccidentEditing(_: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;

        if (this.accidentArray.length === 1) {
            const selectedAccident = this.accidentArray[0];

            this.formValuesToPatch = selectedAccident;

            this.accidentArray = [];
        } else {
            if (this.selectedAccidentIndex >= 0) {
                this.accidentArray[
                    this.selectedAccidentIndex
                ].isEditingAccident = false;
            }

            this.formValuesToPatch = {
                location: null,
                date: null,
                hazmatSpill: null,
                collisions: null,
                fatalities: null,
                injuries: null,
                vehicleType: null,
                description: null,
            };

            this.displayButtonInsteadOfForm = true;
        }

        this.selectedAccidentIndex = -1;
    }

    public saveEditedAccident(event: any): void {
        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues[this.stepFeedbackValues.length - 1];
        }

        if (this.selectedAccidentIndex >= 0) {
            this.accidentArray[this.selectedAccidentIndex] = {
                ...this.accidentArray[this.selectedAccidentIndex],
                ...event,
            };
        } else {
            this.accidentArray = [...this.accidentArray, event];
        }

        this.isEditing = false;

        this.hideFormOnEdit = false;
        this.displayButtonInsteadOfForm = true;

        this.formValuesToPatch = {
            location: null,
            date: null,
            hazmatSpill: null,
            collisions: null,
            fatalities: null,
            injuries: null,
            vehicleType: null,
            description: null,
        };

        this.selectedAccidentIndex = -1;
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.isEditing = true;

            this.displayButtonInsteadOfForm = false;

            this.formValuesToPatch = {
                location: null,
                date: null,
                hazmatSpill: null,
                collisions: null,
                fatalities: null,
                injuries: null,
                vehicleType: null,
                description: null,
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
        this.lastAccidentCard = {
            ...this.lastAccidentCard,
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
        this.previousFormValuesOnReview.accidentItemReview = {
            isLocationValid: !event[0].lineInputs[0],
            isDateValid: !event[0].lineInputs[1],
            isDescriptionValid: !event[1].lineInputs[1],
        };
    }

    public onGetCardOpenAnnotationArrayValues(event: any): void {
        this.isReviewingCard = false;

        this.accidentArray[this.selectedAccidentIndex].isEditingAccident =
            false;

        this.accidentArray[this.selectedAccidentIndex].accidentItemReview = {
            isLocationValid: !event[0].lineInputs[0],
            isDateValid: !event[0].lineInputs[1],
            isDescriptionValid: !event[1].lineInputs[1],
        };

        const hasInvalidFields = JSON.stringify(
            this.accidentArray[this.selectedAccidentIndex].accidentItemReview
        );

        if (hasInvalidFields.includes('false')) {
            if (
                !this.openAnnotationArray[this.selectedAccidentIndex]
                    .displayAnnotationTextArea
            ) {
                this.openAnnotationArray[
                    this.selectedAccidentIndex
                ].displayAnnotationButton = true;
            }

            this.openAnnotationArray[this.selectedAccidentIndex].lineInputs[0] =
                true;

            this.cardsWithIncorrectFields = true;
        } else {
            this.openAnnotationArray[
                this.selectedAccidentIndex
            ].displayAnnotationButton = false;

            this.hasIncorrectFields = false;
        }

        this.selectedAccidentIndex = -1;

        this.previousFormValuesOnReview.accidentItemReview = {
            ...this.previousFormValuesOnReview.accidentItemReview,
            locationDateMessage: this.lastAccidentCard.firstRowReview,
            descriptionMessage: this.lastAccidentCard.secondRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public onGetRadioRequiredNoteEmit(event: any): void {
        if (event) {
            this.displayRadioRequiredNote = true;
        } else {
            this.displayRadioRequiredNote = false;
        }
    }

    public cancelAccidentReview(_: any): void {
        this.isReviewingCard = false;

        this.accidentArray[this.selectedAccidentIndex].isEditingAccident =
            false;

        this.selectedAccidentIndex = -1;

        this.previousFormValuesOnReview.accidentItemReview = {
            ...this.previousFormValuesOnReview.accidentItemReview,
            locationDateMessage: this.lastAccidentCard.firstRowReview,
            descriptionMessage: this.lastAccidentCard.secondRowReview,
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

            this.accidentForm
                .get(`cardReview${lineIndex + 1}`)
                .patchValue(null);

            Object.keys(
                this.accidentArray[lineIndex].accidentItemReview
            ).forEach((key) => {
                this.accidentArray[lineIndex].accidentItemReview[key] = true;
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

    public onCardReview(index: number): void {
        if (this.isReviewingCard) {
            return;
        }

        this.selectedAccidentIndex = index;

        this.accidentArray[index].isEditingAccident = true;

        this.isReviewingCard = true;

        const selectedAccident = this.accidentArray[index];

        this.formValuesToPatch = selectedAccident;
    }

    public startFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            let incorrectValuesArray = [];

            for (let i = 0; i < this.stepFeedbackValues.length; i++) {
                const filteredAccidentRecordIncorrectValues = Object.keys(
                    this.stepFeedbackValues[i]
                )
                    .filter((item) => item !== 'hasIncorrectValue')
                    .reduce((o, key) => {
                        this.stepFeedbackValues[i][key] === false &&
                            (o[key] = this.stepFeedbackValues[i][key]);

                        return o;
                    }, {});

                const hasIncorrectValues = Object.keys(
                    filteredAccidentRecordIncorrectValues
                ).length;

                if (hasIncorrectValues) {
                    const filteredFieldsWithIncorrectValues = Object.keys(
                        filteredAccidentRecordIncorrectValues
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
                            o['date'] =
                                MethodsCalculationsHelper.convertDateFromBackend(
                                    this.stepValues[i].date
                                );
                        }

                        if (keyName === 'location') {
                            o['location'] = JSON.stringify({
                                location: this.stepValues[i].location,
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
                                        ? this.lastAccidentCard[match]
                                        : this.accidentArray[i][match];

                                if (keyName === 'date') {
                                    o['date'] =
                                        i === this.stepFeedbackValues.length - 1
                                            ? this.lastAccidentCard?.date
                                            : this.accidentArray[i].date;
                                }

                                if (keyName === 'location') {
                                    o['location'] = JSON.stringify({
                                        location:
                                            i ===
                                            this.stepFeedbackValues.length - 1
                                                ? this.lastAccidentCard.location
                                                : this.accidentArray[i]
                                                      .location,
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
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === 'back-step') {
            this.router.navigate([`/application/${this.applicantId}/3`]);
        }
    }

    public onSubmit(): void {
        this.checkIsHazmatSpillNotChecked = true;

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

        const { hasPastAccident } = this.accidentForm.value;

        const filteredAccidentArray = this.accidentArray.map((item) => {
            return {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: item.id ? item.id : null,
                    accidentItemReview: item.accidentItemReview
                        ? {
                              ...item.accidentItemReview,
                              accidentItemId: item.id ? item.id : null,
                          }
                        : null,
                }),
                location: item.location,
                date: MethodsCalculationsHelper.convertDateToBackend(item.date),
                fatalities: item.fatalities,
                injuries: item.injuries,
                collisions: item.collisions,
                hazmatSpill: item.hazmatSpill,
                vehicleTypeId: this.vehicleType.find(
                    (vehicleItem) => vehicleItem.name === item.vehicleType
                ).id,
                description: item.description,
            };
        });

        let filteredLastAccidentCard: any;

        if (!hasPastAccident && !this.accidentArray.length) {
            filteredLastAccidentCard = {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: this.lastAccidentCard.id
                        ? this.lastAccidentCard.id
                        : null,
                    accidentItemReview: this.lastAccidentCard.accidentItemReview
                        ? {
                              ...this.lastAccidentCard.accidentItemReview,
                              accidentItemId: this.lastAccidentCard.id
                                  ? this.lastAccidentCard.id
                                  : null,
                          }
                        : null,
                }),
                location: this.lastAccidentCard.location,
                date: MethodsCalculationsHelper.convertDateToBackend(
                    this.lastAccidentCard.date
                ),
                fatalities: this.lastAccidentCard.fatalities,
                injuries: this.lastAccidentCard.injuries,
                collisions: this.lastAccidentCard.collisions,
                hazmatSpill: this.lastAccidentCard.hazmatSpill,
                vehicleTypeId: this.vehicleType.find(
                    (vehicleItem) =>
                        vehicleItem.name === this.lastAccidentCard.vehicleType
                ).id,
                description: this.lastAccidentCard.description,
            };
        }

        const saveData: CreateAccidentRecordCommand = {
            applicantId: this.applicantId,
            noAccidentInThreeYears: hasPastAccident,
            accidents: hasPastAccident
                ? []
                : !this.accidentArray.length
                ? [filteredLastAccidentCard]
                : [...filteredAccidentArray],
        };

        const storeAccidentRecordItems = saveData.accidents.map((item) => {
            return {
                ...item,
                vehicleType: this.vehicleType.find(
                    (vehicleItem) => vehicleItem.id === item.vehicleTypeId
                ),
            };
        });

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createAccidentRecord(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateAccidentRecord(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/5`,
                    ]);

                    this.applicantStore.update((store) => {
                        const noAccidents = saveData.noAccidentInThreeYears;

                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                accidentRecords: {
                                    ...store.applicant.accidentRecords,
                                    noAccidentInThreeYears: noAccidents,
                                    accidents: noAccidents
                                        ? null
                                        : storeAccidentRecordItems,
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
        const accidentArrayReview = this.accidentArray.map((item, index) => {
            const itemReview = item.accidentItemReview;

            return {
                ...(this.stepHasReviewValues && {
                    id: item.reviewId,
                }),
                accidentItemId: item.id,
                isPrimary: false,
                commonMessage: this.accidentForm.get(`cardReview${index + 1}`)
                    .value,
                isLocationValid: itemReview ? itemReview.isLocationValid : true,
                isDateValid: itemReview ? itemReview.isDateValid : true,
                locationDateMessage: null,
                isDescriptionValid: itemReview
                    ? itemReview.isDescriptionValid
                    : true,
                descriptionMessage: null,
            };
        });

        const lastItemReview =
            this.previousFormValuesOnReview.accidentItemReview;

        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;

        const lastReviewedItemInAccidentArray = {
            ...(this.stepHasReviewValues && {
                id: lastItemReviewId,
            }),
            accidentItemId: lastItemId,
            isPrimary: true,
            commonMessage: null,
            isLocationValid: lastItemReview.isLocationValid ?? true,
            isDateValid: lastItemReview.isDateValid ?? true,
            locationDateMessage: this.lastAccidentCard.firstRowReview,
            isDescriptionValid: lastItemReview.isDescriptionValid ?? true,
            descriptionMessage: this.lastAccidentCard.secondRowReview,
        };

        const saveData: CreateAccidentRecordReviewCommand = {
            applicantId: this.applicantId,
            accidentReviews: [
                ...accidentArrayReview,
                lastReviewedItemInAccidentArray,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createAccidentRecordReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateAccidentRecordReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/5`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                accidentRecords: {
                                    ...store.applicant.accidentRecords,
                                    accidents:
                                        store.applicant.accidentRecords.accidents.map(
                                            (item, index) => {
                                                if (
                                                    index ===
                                                    store.applicant
                                                        .accidentRecords
                                                        .accidents.length -
                                                        1
                                                ) {
                                                    return {
                                                        ...item,
                                                        accidentItemReview: {
                                                            ...item.accidentItemReview,
                                                            isLocationValid:
                                                                lastReviewedItemInAccidentArray.isLocationValid,
                                                            isDateValid:
                                                                lastReviewedItemInAccidentArray.isDateValid,
                                                            locationDateMessage:
                                                                lastReviewedItemInAccidentArray.locationDateMessage,
                                                            isDescriptionValid:
                                                                lastReviewedItemInAccidentArray.isDescriptionValid,
                                                            descriptionMessage:
                                                                lastReviewedItemInAccidentArray.descriptionMessage,
                                                        },
                                                    };
                                                }

                                                return {
                                                    ...item,
                                                    accidentItemReview: {
                                                        ...item.accidentItemReview,
                                                        ...accidentArrayReview[
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
