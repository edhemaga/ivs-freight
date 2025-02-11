/* eslint-disable no-unused-vars */
import { CommonModule } from '@angular/common';

import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';

import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import {
    Subscription,
    Subject,
    takeUntil,
    distinctUntilChanged,
    throttleTime,
} from 'rxjs';

// moment
import moment from 'moment';

// helpers
import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';

// validations
import {
    addressValidation,
    descriptionValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// sevices
import { FormService } from '@shared/services/form.service';
import { TaInputService } from '@shared/services/ta-input.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';

// models
import { Violation } from '@pages/applicant/pages/applicant-application/models/violation.model';
import {
    AddressEntity,
    ApplicantModalResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// config
import { Step5FormConfig } from '@pages/applicant/components/applicant-forms/step5-form/configs/step5-form.config';
import { CaInputDatetimePickerComponent } from 'ca-components';

@Component({
    selector: 'app-step5-form',
    templateUrl: './step5-form.component.html',
    styleUrls: ['./step5-form.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        SharedModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
        ApplicantAddSaveBtnComponent,
        TaAppTooltipV2Component,
        TaInputAddressDropdownComponent,
        CaInputDatetimePickerComponent
    ],
})
export class Step5FormComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;
    @Input() stepFeedbackValues?: any;

    @Output() formValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormEditingEmitter = new EventEmitter<any>();
    @Output() saveFormEditingEmitter = new EventEmitter<any>();
    @Output() formStatusEmitter = new EventEmitter<any>();
    @Output() markInvalidEmitter = new EventEmitter<any>();
    @Output() lastFormValuesEmitter = new EventEmitter<any>();
    @Output() hasIncorrectFieldsEmitter = new EventEmitter<any>();
    @Output() openAnnotationArrayValuesEmitter = new EventEmitter<any>();
    @Output() cardOpenAnnotationArrayValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormReviewingEmitter = new EventEmitter<any>();
    @Output() onDeleteViolationClick = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public selectedMode = SelectedMode.APPLICANT;

    private subscription: Subscription;

    public violationsForm: UntypedFormGroup;

    public isViolationEdited: boolean;

    public selectedVehicleType: any = null;
    public selectedAddress: AddressEntity = null;

    public vehicleType: TruckTypeResponse[] = [];

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
        {
            lineIndex: 10,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 11,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public isCardReviewedIncorrect: boolean = false;

    public applicantSvgRoutes = ApplicantSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private applicantQuery: ApplicantQuery
    ) {}

    get addressInputConfig(): ITaInput {
        return Step5FormConfig.getAddressInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
            isEditing: this.isEditing,
        });
    }

    get dateInputConfig(): ITaInput {
        return Step5FormConfig.getDateInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get vehicleTypeInputConfig(): ITaInput {
        return Step5FormConfig.getVehicleTypeInputConfig({
            selectedMode: this.selectedMode,
            selectedVehicleType: this.selectedVehicleType,
        });
    }

    get descriptionInputConfig(): ITaInput {
        return Step5FormConfig.getDescriptionInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();
    }

    ngAfterViewInit(): void {
        if (this.selectedMode !== SelectedMode.REVIEW) {
            this.violationsForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.violationsForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    this.lastFormValuesEmitter.emit({
                        ...res,
                        location: this.selectedAddress,
                    });
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.violationsForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    const reviewMessages = {
                        firstRowReview: res.firstRowReview,
                        secondRowReview: res.secondRowReview,
                    };

                    this.lastFormValuesEmitter.emit(reviewMessages);
                });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode?.previousValue !== changes.mode?.currentValue) {
            this.selectedMode = changes.mode?.currentValue;
        }

        if (this.selectedMode === SelectedMode.APPLICANT) {
            if (
                changes.markFormInvalid?.previousValue !==
                changes.markFormInvalid?.currentValue
            ) {
                this.inputService.markInvalid(this.violationsForm);
                this.markInvalidEmitter.emit(false);
            }
        }

        if (
            changes.formValuesToPatch?.previousValue !==
            changes.formValuesToPatch?.currentValue
        ) {
            setTimeout(() => {
                this.patchForm(changes.formValuesToPatch.currentValue);
                this.selectedAddress =
                    changes.formValuesToPatch.currentValue.location;

                if (this.selectedMode !== SelectedMode.REVIEW) {
                    this.startValueChangesMonitoring();
                }
            }, 50);
        }
    }

    public createForm(): void {
        this.violationsForm = this.formBuilder.group({
            date: [null, Validators.required],
            vehicleType: [null, Validators.required],
            location: [null, [Validators.required, ...addressValidation]],
            description: [
                null,
                [Validators.required, ...descriptionValidation],
            ],

            firstRowReview: [null],
            secondRowReview: [null],
        });
    }

    public patchForm(formValue: any): void {
        if (this.selectedMode === SelectedMode.REVIEW) {
            if (
                formValue.trafficViolationItemReview &&
                Object.keys(formValue.trafficViolationItemReview).length > 2
            ) {
                const {
                    isDateValid,
                    isLocationValid,
                    locationMessage,
                    isDescriptionValid,
                    descriptionMessage,
                } = formValue.trafficViolationItemReview;

                this.openAnnotationArray[10] = {
                    ...this.openAnnotationArray[10],
                    lineInputs: [!isDateValid, false, !isLocationValid],
                    displayAnnotationButton:
                        (!isDateValid || !isLocationValid) && !locationMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: locationMessage ? true : false,
                };
                this.openAnnotationArray[11] = {
                    ...this.openAnnotationArray[11],
                    lineInputs: [!isDescriptionValid],
                    displayAnnotationButton:
                        !isDescriptionValid && !descriptionMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: descriptionMessage
                        ? true
                        : false,
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFieldsEmitter.emit(true);

                    this.isCardReviewedIncorrect = true;
                } else {
                    this.hasIncorrectFieldsEmitter.emit(false);

                    this.isCardReviewedIncorrect = false;
                }

                this.violationsForm.patchValue({
                    firstRowReview: locationMessage,
                    secondRowReview: descriptionMessage,
                });
            }
        }

        this.violationsForm.patchValue({
            date: formValue?.date,
            vehicleType: formValue?.vehicleType,
            location: formValue?.location,
            description: formValue?.description,
        });

        setTimeout(() => {
            this.selectedVehicleType = this.vehicleType.find(
                (item) => item.name === formValue.vehicleType
            );
        }, 50);
    }

    public startValueChangesMonitoring() {
        this.subscription = this.violationsForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((updatedFormValues) => {
                const {
                    id,
                    reviewId,
                    vehicleTypeLogoName,
                    date,
                    isEditingViolation,
                    trafficViolationItemReview,
                    ...previousFormValues
                } = this.formValuesToPatch;

                previousFormValues.date = moment(new Date(date)).format(
                    'MM/DD/YY'
                );

                const { firstRowReview, secondRowReview, ...newFormValues } =
                    updatedFormValues;

                if (isFormValueEqual(previousFormValues, newFormValues)) {
                    this.isViolationEdited = false;
                } else {
                    this.isViolationEdited = true;
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.VEHICLE_TYPE:
                this.selectedVehicleType = event;

                break;
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.violationsForm
                        .get('location')
                        .setErrors({ invalid: true });
                }

                break;

            default:
                break;
        }
    }

    public onAddViolation(): void {
        if (this.violationsForm.invalid) {
            this.inputService.markInvalid(this.violationsForm);
            return;
        }

        const { firstRowReview, secondRowReview, ...violationsForm } =
            this.violationsForm.value;

        const saveData: Violation = {
            ...violationsForm,
            isEditingViolation: false,
            vehicleTypeLogoName: this.vehicleType.find(
                (item) => item.name === violationsForm.vehicleType
            ).logoName,
            location: this.selectedAddress,
        };

        this.formValuesEmitter.emit(saveData);

        this.selectedVehicleType = null;

        this.formService.resetForm(this.violationsForm);
    }

    public onCancelEditAccident(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isViolationEdited = false;

        this.formStatusEmitter.emit('VALID');

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onSaveEditedViolation(): void {
        if (this.violationsForm.invalid || !this.isViolationEdited) {
            if (this.violationsForm.invalid) {
                this.inputService.markInvalid(this.violationsForm);
            }

            return;
        }

        const { firstRowReview, secondRowReview, ...violationsForm } =
            this.violationsForm.value;

        const saveData: Violation = {
            ...violationsForm,
            isEditingViolation: false,
            vehicleTypeLogoName: this.vehicleType.find(
                (item) => item.name === violationsForm.vehicleType
            ).logoName,
            location: this.selectedAddress,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isViolationEdited = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.onAddViolation();
        }

        if (event.cancelClick) {
            this.onCancelEditAccident();
        }

        if (event.saveClick) {
            this.onSaveEditedViolation();
        }

        if (event.reviewCancelClick) {
            this.onCancelReviewViolation();
        }

        if (event.reviewSaveClick) {
            this.onAddAnnotation();
        }
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.vehicleType = res.truckTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });
            });
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (this.isReviewingCard) {
            if (event) {
                selectedInputsLine.lineInputs[inputIndex] = true;
            }

            if (!event) {
                selectedInputsLine.lineInputs[inputIndex] = false;
            }

            const inputFieldsArray = JSON.stringify(
                this.openAnnotationArray
                    .filter((item) => Object.keys(item).length !== 0)
                    .map((item) => item.lineInputs)
            );

            if (inputFieldsArray.includes('true')) {
                this.isCardReviewedIncorrect = true;
            } else {
                this.isCardReviewedIncorrect = false;
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

                switch (lineIndex) {
                    case 10:
                        if (!isAnyInputInLineIncorrect) {
                            this.violationsForm
                                .get('firstRowReview')
                                .patchValue(null);
                        }

                        break;

                    case 11:
                        this.violationsForm
                            .get('secondRowReview')
                            .patchValue(null);

                        break;

                    default:
                        break;
                }
            }
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray
                .filter((item) => Object.keys(item).length !== 0)
                .map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.hasIncorrectFieldsEmitter.emit(true);
        } else {
            this.hasIncorrectFieldsEmitter.emit(false);
        }

        const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
            (item) => Object.keys(item).length !== 0
        );

        this.openAnnotationArrayValuesEmitter.emit(filteredOpenAnnotationArray);
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

    public onCancelReviewViolation(): void {
        this.cancelFormReviewingEmitter.emit(1);

        this.isCardReviewedIncorrect = false;
    }

    public onAddAnnotation(): void {
        if (!this.isCardReviewedIncorrect) {
            return;
        }

        const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
            (item) => Object.keys(item).length !== 0
        );

        this.cardOpenAnnotationArrayValuesEmitter.emit(
            filteredOpenAnnotationArray
        );

        this.isCardReviewedIncorrect = false;
    }

    public onDeleteViolation(): void {
        this.onDeleteViolationClick.emit(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
