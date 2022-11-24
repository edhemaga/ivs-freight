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

import moment from 'moment';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '../../state/utils/utils';

import {
    addressValidation,
    descriptionValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { FormService } from './../../../../services/form/form.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ViolationModel } from '../../state/model/violations.model';
import {
    AddressEntity,
    ApplicantModalResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step5-form',
    templateUrl: './step5-form.component.html',
    styleUrls: ['./step5-form.component.scss'],
})
export class Step5FormComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;

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

    private destroy$ = new Subject<void>();

    public selectedMode = SelectedMode.APPLICANT;

    private subscription: Subscription;

    public violationsForm: FormGroup;

    public isViolationEdited: boolean;

    public editingCardAddress: any;

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

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();
    }

    ngAfterViewInit(): void {
        if (this.selectedMode === SelectedMode.APPLICANT) {
            this.violationsForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.violationsForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    res.location = this.selectedAddress;

                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.violationsForm.valueChanges
                .pipe(takeUntil(this.destroy$))
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
                console.log(
                    '  changes.markFormInvalid?.currentValue',
                    changes.markFormInvalid?.currentValue
                );
                this.inputService.markInvalid(this.violationsForm);
                this.markInvalidEmitter.emit(false);
            }
        }

        if (
            this.selectedMode === SelectedMode.REVIEW ||
            this.selectedMode === SelectedMode.APPLICANT
        ) {
            if (
                changes.formValuesToPatch?.previousValue !==
                changes.formValuesToPatch?.currentValue
            ) {
                setTimeout(() => {
                    this.patchForm(changes.formValuesToPatch.currentValue);

                    if (this.selectedMode === SelectedMode.APPLICANT) {
                        this.startValueChangesMonitoring();
                    }
                }, 50);
            }
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
            if (formValue.trafficViolationItemReview) {
                const { isDateValid, isLocationValid, isDescriptionValid } =
                    formValue.trafficViolationItemReview;

                this.openAnnotationArray[10] = {
                    ...this.openAnnotationArray[10],
                    lineInputs: [!isDateValid, false, !isLocationValid],
                };
                this.openAnnotationArray[11] = {
                    ...this.openAnnotationArray[11],
                    lineInputs: [!isDescriptionValid],
                };
            }
        }

        this.violationsForm.patchValue({
            date: formValue?.date,
            vehicleType: formValue?.vehicleType,
            location: formValue.location ? formValue?.location?.address : null,
            description: formValue?.description,
        });

        setTimeout(() => {
            this.selectedAddress = formValue.location;

            this.selectedVehicleType = this.vehicleType.find(
                (item) => item.name === formValue.vehicleType
            );
        }, 50);
    }

    public startValueChangesMonitoring() {
        this.subscription = this.violationsForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((updatedFormValues) => {
                const {
                    id,
                    date,
                    location,
                    isEditingViolation,
                    trafficViolationItemReview,
                    ...previousFormValues
                } = this.formValuesToPatch;

                previousFormValues.location = location?.address;
                previousFormValues.date = moment(new Date(date)).format(
                    'MM/DD/YY'
                );

                this.editingCardAddress = location;

                const {
                    firstRowReview,
                    secondRowReview,
                    location: newLocation,
                    ...newFormValues
                } = updatedFormValues;

                newFormValues.location = newLocation?.address;

                if (isFormValueEqual(previousFormValues, newFormValues)) {
                    this.isViolationEdited = false;
                } else {
                    this.isViolationEdited = true;
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.TRUCK_TYPE:
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

        const { location, firstRowReview, secondRowReview, ...violationsForm } =
            this.violationsForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: '',
            county: '',
        };

        const saveData: ViolationModel = {
            ...violationsForm,
            isEditingViolation: false,
            location: selectedAddress,
        };

        this.formValuesEmitter.emit(saveData);

        this.selectedAddress = null;
        this.selectedVehicleType = null;

        this.formService.resetForm(this.violationsForm);
    }

    public onSaveEditedViolation(): void {
        if (this.violationsForm.invalid) {
            this.inputService.markInvalid(this.violationsForm);
            return;
        }

        if (!this.isViolationEdited) {
            return;
        }

        const { firstRowReview, secondRowReview, ...violationsForm } =
            this.violationsForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: '',
            county: '',
        };

        const saveData: ViolationModel = {
            ...violationsForm,
            location: this.selectedAddress
                ? selectedAddress
                : this.editingCardAddress,
            isEditingViolation: false,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isViolationEdited = false;

        this.formService.resetForm(this.violationsForm);

        this.subscription.unsubscribe();
    }

    public onCancelEditAccident(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isViolationEdited = false;

        this.formService.resetForm(this.violationsForm);

        this.subscription.unsubscribe();
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.vehicleType = res.truckTypes.map((item) => {
                    if (item.id === 3) {
                        return {
                            ...item,
                            name: 'Tow Truck',
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    }

                    if (item.id === 4) {
                        return {
                            ...item,
                            name: 'Car Hauler',
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    }

                    if (item.id === 6) {
                        return {
                            ...item,
                            name: 'Semi w/Sleeper',
                            folder: 'common',
                            subFolder: 'trucks',
                        };
                    }

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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
