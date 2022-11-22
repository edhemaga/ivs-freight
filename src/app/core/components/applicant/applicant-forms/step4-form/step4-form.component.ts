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
    ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Subscription, Subject, takeUntil } from 'rxjs';

import moment from 'moment';

import {
    addressValidation,
    descriptionValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '../../state/utils/utils';

import { AnswerChoices } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import {
    AddressEntity,
    ApplicantModalResponse,
    TruckTypeResponse,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { AccidentModel } from '../../state/model/accident.model';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { FormService } from './../../../../services/form/form.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import { TaInputRadiobuttonsComponent } from '../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';

@Component({
    selector: 'app-step4-form',
    templateUrl: './step4-form.component.html',
    styleUrls: ['./step4-form.component.scss'],
})
export class Step4FormComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    @ViewChild(TaInputRadiobuttonsComponent)
    component: TaInputRadiobuttonsComponent;

    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;
    @Input() displayRadioRequiredNote: boolean = false;
    @Input() checkIsHazmatSpillNotChecked: boolean;

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
    @Output() radioRequiredNoteEmitter = new EventEmitter<any>();

    private destroy$ = new Subject<void>();

    public selectedMode = SelectedMode.APPLICANT;

    private subscription: Subscription;

    public accidentForm: FormGroup;

    public selectedAddress: AddressEntity;
    public selectedVehicleType: any = null;

    public isAccidentEdited: boolean;

    public editingCardAddress: any;

    public vehicleType: TruckTypeResponse[] = [];

    public hazmatSpillRadios: any;

    public answerChoices: AnswerChoices[] = [
        {
            id: 1,
            label: 'YES',
            value: 'hazmatYes',
            name: 'hazmatYes',
            checked: false,
        },
        {
            id: 2,
            label: 'NO',
            value: 'hazmatNo',
            name: 'hazmatNo',
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
        {
            lineIndex: 10,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 11,
            lineInputs: [false, false],
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
        this.hazmatSpillRadios = this.component.buttons;

        if (this.selectedMode === SelectedMode.APPLICANT) {
            this.accidentForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.accidentForm.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    if (this.selectedAddress) {
                        const selectedAddress = {
                            ...this.selectedAddress,
                            addressUnit: '',
                            county: '',
                        };

                        res.location = selectedAddress;
                    }

                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.accidentForm.valueChanges
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

<<<<<<< HEAD
        if (
            this.selectedMode === SelectedMode.APPLICANT ||
            this.selectedMode === SelectedMode.FEEDBACK
        ) {
            if (
                changes.markFormInvalid?.previousValue !==
                changes.markFormInvalid?.currentValue
            ) {
                this.inputService.markInvalid(this.accidentForm);
=======
            if (this.selectedMode === SelectedMode.APPLICANT) {
                if (
                    changes.markFormInvalid?.previousValue !==
                    changes.markFormInvalid?.currentValue
                ) {
                    this.inputService.markInvalid(this.accidentForm);
>>>>>>> develop

                    this.markInvalidEmitter.emit(false);
                }
            }
<<<<<<< HEAD

            if (
                changes.checkIsHazmatSpillNotChecked?.previousValue !==
                changes.checkIsHazmatSpillNotChecked?.currentValue
            ) {
                let hazmatSpillRadios: any;

                if (!changes.checkIsHazmatSpillNotChecked?.firstChange) {
                    hazmatSpillRadios =
                        this.accidentForm.get('hazmatSpill').value;
                }

                if (hazmatSpillRadios === null) {
                    this.radioRequiredNoteEmitter.emit(true);
                }
            }
        }
=======
>>>>>>> develop

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
                    }, 100);
                }
            }
        }
    }

    public createForm(): void {
        this.accidentForm = this.formBuilder.group({
            location: [null, [Validators.required, ...addressValidation]],
            date: [null, Validators.required],
            fatalities: [0],
            injuries: [0],
            hazmatSpill: [null, Validators.required],
            vehicleType: [null, Validators.required],
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
            if (formValue.accidentRecordReview) {
                const {
                    isLocationValid,
                    isDateValid,
                    isVehicleTypeValid,
                    isDescriptionValid,
                } = formValue.accidentRecordReview;

                this.openAnnotationArray[10] = {
                    ...this.openAnnotationArray[10],
                    lineInputs: [!isLocationValid, !isDateValid],
                };
                this.openAnnotationArray[11] = {
                    ...this.openAnnotationArray[11],
                    lineInputs: [!isVehicleTypeValid, !isDescriptionValid],
                };
            }
        }

        this.accidentForm.patchValue({
            location: formValue?.location ? formValue?.location?.address : null,
            date: formValue?.date,
            hazmatSpill: formValue?.hazmatSpill,
            fatalities: formValue?.fatalities,
            injuries: formValue?.injuries,
            vehicleType: formValue?.vehicleType,
            description: formValue?.description,
        });

        this.selectedAddress = formValue?.location;

        setTimeout(() => {
            const hazmatSpillValue = this.accidentForm.get('hazmatSpill').value;

            if (hazmatSpillValue) {
                this.hazmatSpillRadios[0].checked = true;
            } else {
                this.hazmatSpillRadios[1].checked = true;
            }

            if (hazmatSpillValue === null) {
                this.hazmatSpillRadios[0].checked = false;
                this.hazmatSpillRadios[1].checked = false;
            }

            this.selectedVehicleType = this.vehicleType.find(
                (item) => item.name === formValue?.vehicleType
            );
        }, 150);
    }

    public startValueChangesMonitoring(): void {
        this.subscription = this.accidentForm.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((updatedFormValues) => {
                const {
                    date,
                    location,
                    accidentState,
                    isEditingAccident,
                    accidentRecordReview,
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
                    this.isAccidentEdited = false;
                } else {
                    this.isAccidentEdited = true;
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.HAZMAT_SPILL:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                if (selectedCheckbox.label === 'YES') {
                    this.accidentForm.get('hazmatSpill').patchValue(true);
                } else {
                    this.accidentForm.get('hazmatSpill').patchValue(false);
                }

                this.radioRequiredNoteEmitter.emit(false);

                break;
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedVehicleType = event;

                break;
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.accidentForm
                        .get('location')
                        .setErrors({ invalid: true });
                }

                break;
            default:
                break;
        }
    }

    public onAddAccident(): void {
        if (this.accidentForm.invalid) {
            this.inputService.markInvalid(this.accidentForm);
            return;
        }

        const { location, firstRowReview, secondRowReview, ...accidentForm } =
            this.accidentForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: '',
            county: '',
        };

        const saveData: AccidentModel = {
            ...accidentForm,
            location: selectedAddress,
            accidentState: this.selectedAddress.stateShortName,
            isEditingAccident: false,
        };

        this.formValuesEmitter.emit(saveData);

        this.hazmatSpillRadios[0].checked = false;
        this.hazmatSpillRadios[1].checked = false;

        this.selectedVehicleType = null;

        this.formService.resetForm(this.accidentForm);

        this.accidentForm.patchValue({
            fatalities: 0,
            injuries: 0,
        });
    }

    public onCancelEditAccident(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isAccidentEdited = false;

        this.hazmatSpillRadios[0].checked = false;
        this.hazmatSpillRadios[1].checked = false;

        this.formService.resetForm(this.accidentForm);

        this.subscription.unsubscribe();
    }

    public onSaveEditedAccident(): void {
        if (this.accidentForm.invalid) {
            this.inputService.markInvalid(this.accidentForm);
            return;
        }

        if (!this.isAccidentEdited) {
            return;
        }

        const { location, firstRowReview, secondRowReview, ...accidentForm } =
            this.accidentForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: '',
            county: '',
        };

        const saveData: AccidentModel = {
            ...accidentForm,
            location: this.selectedAddress
                ? selectedAddress
                : this.editingCardAddress,
            accidentState: this.selectedAddress
                ? this.selectedAddress.stateShortName
                : this.editingCardAddress.stateShortName,
            isEditingAccident: false,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isAccidentEdited = false;

        this.formService.resetForm(this.accidentForm);

        this.subscription.unsubscribe();
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
                            this.accidentForm
                                .get('firstRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 11:
                        if (!isAnyInputInLineIncorrect) {
                            this.accidentForm
                                .get('secondRowReview')
                                .patchValue(null);
                        }

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

    public onCancelReviewAccident(): void {
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
