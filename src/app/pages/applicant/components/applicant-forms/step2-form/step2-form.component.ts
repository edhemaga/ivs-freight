/* eslint-disable no-unused-vars */

import { CommonModule } from '@angular/common';
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
    UntypedFormArray,
    FormsModule,
    ReactiveFormsModule,
    AbstractControl,
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
    phoneFaxRegex,
    addressUnitValidation,
    businessNameValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';

// routes
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

// models
import { ApplicantQuestion } from '@pages/applicant/pages/applicant-application/models/applicant-question.model';
import { WorkExpereience } from '@pages/applicant/pages/applicant-application/models/work-experience.model';
import {
    ApplicantModalResponse,
    EnumValue,
    TrailerLengthResponse,
    TrailerTypeResponse,
    TruckTypeResponse,
    AddressEntity,
} from 'appcoretruckassist/model/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaInputSwitchOnOffComponent } from '@shared/components/ta-input-switch-on-off/ta-input-switch-on-off.component';
import { TaInputRadiobuttonsComponent } from '@shared/components/ta-input-radiobuttons/ta-input-radiobuttons.component';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// configs
import { Step2FormConfig } from '@pages/applicant/components/applicant-forms/step2-form/config/step2-form.config';

@Component({
    selector: 'app-step2-form',
    templateUrl: './step2-form.component.html',
    styleUrls: ['./step2-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
        TaInputAddressDropdownComponent,
        TaCheckboxComponent,
        TaInputSwitchOnOffComponent,
        TaInputRadiobuttonsComponent,
        ApplicantAddSaveBtnComponent,
        TaAppTooltipV2Component,
    ],
})
export class Step2FormComponent
    implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
    @ViewChildren('cmp') set content(content: QueryList<any>) {
        if (content) {
            const radioButtonsArray = content.toArray();

            this.cfrPartRadios = radioButtonsArray[0]
                ? radioButtonsArray[0].buttons
                : null;
            this.fmcsaRadios = radioButtonsArray[1]
                ? radioButtonsArray[1].buttons
                : null;
        }
    }

    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;
    @Input() displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    };
    @Input() checkIsRadioUnchecked: boolean;
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
    @Output() radioRequiredNoteEmitter = new EventEmitter<any>();
    @Output() onDeleteWorkExperienceClick = new EventEmitter<boolean>();

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public subscription: Subscription;

    public workExperienceForm: UntypedFormGroup;

    public isWorkExperienceEdited: boolean;

    public isTruckSelectedArr: boolean[] = [];
    public isBoxTruckSelectedArr: boolean[] = [];

    public editingCardAddress: any;

    public selectedAddress: AddressEntity;
    public selectedReasonForLeaving: any = null;
    public selectedVehicleTypeArr: any[] = [];
    public selectedTrailerTypeArr: any[] = [];
    public selectedTrailerLengthArr: any[] = [];

    public vehicleType: TruckTypeResponse[] = [];
    public trailerType: TrailerTypeResponse[] = [];
    public trailerLengthType: TrailerLengthResponse[] = [];
    public boxTruckLengthType: EnumValue[] = [];

    public filteredTrailerTypeArr: any = [];
    public filteredLengthTypeArr: any = [];

    public previousValuesOnDrivingPositionCheck: any = [];

    private cfrPartRadios: any;
    private fmcsaRadios: any;

    public displaySwitchCfrPartRequiredStateArray: boolean[] = [false];
    public displaySwitchFmcsaRequiredStateArray: boolean[] = [false];

    public reasonsForLeaving: EnumValue[] = [];

    public questions: ApplicantQuestion[] = [
        {
            title: 'CFR Part 40?',
            formControlName: 'cfrPart',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'cfrPartYes',
                    name: 'cfrPartYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'cfrPartNo',
                    name: 'cfrPartNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'FMCSA Regulated',
            formControlName: 'fmcsa',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'fmcsaYes',
                    name: 'fmcsaYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'fmcsaNo',
                    name: 'fmcsaNo',
                    checked: false,
                    index: 1,
                },
            ],
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
        {},
        {},
        {},
        {},
        {},
        {},
        {
            lineIndex: 20,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 21,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 22,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 23,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 24,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 25,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 26,
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
        private applicantQuery: ApplicantQuery,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    get currentEmploymentFormControl(): AbstractControl {
        return this.workExperienceForm.get('currentEmployment');
    }

    get employerInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get employerPhoneInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerPhoneInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get employerEmailInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerEmailInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get employerFaxInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerFaxInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get employerAddressInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerAddressInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
            isEditing: this.isEditing,
        });
    }

    get employerAddressUnitInputConfig(): ITaInput {
        return Step2FormConfig.getEmployerAddressUnitInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get jobDescriptionInputConfig(): ITaInput {
        return Step2FormConfig.getJobDescriptionInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get fromDateInputConfig(): ITaInput {
        return Step2FormConfig.getFromDateInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get toDateInputConfig(): ITaInput {
        return Step2FormConfig.getToDateInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
            currentEmploymentFormControl: this.currentEmploymentFormControl,
        });
    }

    get reasonForLeavingInputConfig(): ITaInput {
        return Step2FormConfig.getReasonForLeavingInputConfig({
            selectedMode: this.selectedMode,
            isEditing: this.isEditing,
            currentEmploymentFormControl: this.currentEmploymentFormControl,
        });
    }

    get accountForPeriodInputConfig(): ITaInput {
        return Step2FormConfig.getAccountForPeriodInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();

        this.isDriverPosition();

        this.listenCurrentEmployment();
    }

    ngAfterViewInit(): void {
        if (this.selectedMode !== SelectedMode.REVIEW) {
            this.workExperienceForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.workExperienceForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    if (this.selectedAddress) {
                        const selectedAddress = {
                            ...this.selectedAddress,
                            addressUnit: '',
                            county: '',
                        };

                        res.employerAddress = selectedAddress;
                    }

                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.workExperienceForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    const reviewMessages = {
                        firstRowReview: res.firstRowReview,
                        secondRowReview: res.secondRowReview,
                        thirdRowReview: res.thirdRowReview,
                        fourthRowReview: res.fourthRowReview,
                        sixthRowReview: res.sixthRowReview,
                        seventhRowReview: res.seventhRowReview,
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
                this.inputService.markInvalid(this.workExperienceForm);

                this.markInvalidEmitter.emit(false);
            }

            if (
                changes.checkIsRadioUnchecked?.previousValue !==
                changes.checkIsRadioUnchecked?.currentValue
            ) {
                if (this.classesOfEquipment?.length) {
                    const cfrPartRadios: any = this.classesOfEquipment
                        .at(0)
                        .get('cfrPart').value;

                    const fmcsaRadios: any = this.classesOfEquipment
                        .at(0)
                        .get('cfrPart').value;

                    if (cfrPartRadios === null) {
                        this.radioRequiredNoteEmitter.emit({
                            id: 0,
                            displayRadioRequiredNote: true,
                        });
                    }

                    if (fmcsaRadios === null) {
                        this.radioRequiredNoteEmitter.emit({
                            id: 1,
                            displayRadioRequiredNote: true,
                        });
                    }
                }
            }
        }

        if (
            changes.formValuesToPatch?.previousValue !==
            changes.formValuesToPatch?.currentValue
        ) {
            setTimeout(() => {
                this.patchForm(changes.formValuesToPatch.currentValue);

                if (this.selectedMode !== SelectedMode.REVIEW) {
                    this.startValueChangesMonitoring();
                }
            }, 50);
        }
    }

    public get classesOfEquipment(): UntypedFormArray {
        return this.workExperienceForm?.get(
            'classesOfEquipment'
        ) as UntypedFormArray;
    }

    public trackByIdentity = (_: number, item: any): any => item;

    private createForm(): void {
        this.workExperienceForm = this.formBuilder.group({
            employer: [null, [Validators.required, ...businessNameValidation]],
            employerPhone: [null, [Validators.required, phoneFaxRegex]],
            employerEmail: [null, [Validators.required]],
            employerFax: [null, phoneFaxRegex],
            employerAddress: [
                null,
                [Validators.required, ...addressValidation],
            ],
            employerAddressUnit: [null, addressUnitValidation],
            jobDescription: [null, Validators.required],
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            reasonForLeaving: [null, Validators.required],
            accountForPeriod: [null],

            isDrivingPosition: [false],
            currentEmployment: [false],

            classesOfEquipment: this.formBuilder.array([]),

            firstRowReview: [null],
            secondRowReview: [null],
            thirdRowReview: [null],
            fourthRowReview: [null],
            fifthRowReview: [null],
            sixthRowReview: [null],
            seventhRowReview: [null],
        });

        this.inputService.customInputValidator(
            this.workExperienceForm.get('employerEmail'),
            'email',
            this.destroy$
        );
    }

    private isDriverPosition(): void {
        this.workExperienceForm
            .get('isDrivingPosition')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                setTimeout(() => {
                    if (this.cfrPartRadios) {
                        this.cfrPartRadios[0].checked = false;
                        this.cfrPartRadios[1].checked = false;
                    }

                    if (this.fmcsaRadios) {
                        this.fmcsaRadios[0].checked = false;
                        this.fmcsaRadios[1].checked = false;
                    }
                }, 50);

                if (value) {
                    this.patchClassOfEquipment(
                        this.previousValuesOnDrivingPositionCheck
                    );

                    this.classesOfEquipment.controls.forEach((item) => {
                        const vehicleTypeId = this.vehicleType.find(
                            (vehicleItem) =>
                                vehicleItem.name === item.value.vehicleType
                        )?.id;

                        this.inputService.changeValidators(
                            item.get('vehicleType')
                        );

                        this.inputService.changeValidators(item.get('cfrPart'));
                        this.inputService.changeValidators(item.get('fmcsa'));

                        if (vehicleTypeId === 5) {
                            this.inputService.changeValidators(
                                item.get('trailerType'),
                                false
                            );

                            this.inputService.changeValidators(
                                item.get('trailerLength'),
                                false
                            );
                        }

                        if (vehicleTypeId === 2) {
                            this.inputService.changeValidators(
                                item.get('trailerType'),
                                false
                            );
                        }
                    });
                } else {
                    this.previousValuesOnDrivingPositionCheck =
                        this.classesOfEquipment.value;

                    this.classesOfEquipment.clear();

                    this.classesOfEquipment.controls.forEach((item) => {
                        this.inputService.changeValidators(
                            item.get('vehicleType'),
                            false
                        );
                        this.inputService.changeValidators(
                            item.get('trailerType'),
                            false
                        );
                        this.inputService.changeValidators(
                            item.get('trailerLength'),
                            false
                        );
                        this.inputService.changeValidators(
                            item.get('cfrPart'),
                            false
                        );
                        this.inputService.changeValidators(
                            item.get('fmcsa'),
                            false
                        );
                    });
                }
            });
    }

    private listenCurrentEmployment(): void {
        this.currentEmploymentFormControl.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.workExperienceForm.get('reasonForLeaving').disable();
                    this.workExperienceForm.get('reasonForLeaving').reset();
                    this.workExperienceForm.get('toDate').disable();
                    this.workExperienceForm.get('toDate').reset();
                } else {
                    this.workExperienceForm.get('reasonForLeaving').enable();
                    this.workExperienceForm.get('toDate').enable();
                }
            });
    }

    public patchClassOfEquipment(equipmentValue: any): void {
        if (equipmentValue.length) {
            this.classesOfEquipment.clear();

            for (let i = 0; i < equipmentValue.length; i++) {
                const selectedEquipmentItem = equipmentValue[i];

                this.classesOfEquipment.push(this.createClassOfEquipment());

                this.classesOfEquipment.at(i).patchValue({
                    vehicleType: selectedEquipmentItem.vehicleType,
                    trailerType: selectedEquipmentItem.trailerType,
                    trailerLength: selectedEquipmentItem.trailerLength,
                    cfrPart: selectedEquipmentItem.cfrPart,
                    fmcsa: selectedEquipmentItem.fmcsa,
                });

                this.selectedVehicleTypeArr[i] = this.vehicleType.find(
                    (item) => item.name === selectedEquipmentItem.vehicleType
                );
                this.selectedTrailerTypeArr[i] = this.trailerType.find(
                    (item) => item.name === selectedEquipmentItem.trailerType
                );
                this.selectedTrailerLengthArr[i] =
                    this.trailerLengthType.find(
                        (item) =>
                            item.name === selectedEquipmentItem.trailerLength
                    ) ||
                    this.boxTruckLengthType.find(
                        (item) =>
                            item.name === selectedEquipmentItem.trailerLength
                    );

                const vehicleTypeId = this.selectedVehicleTypeArr[i]?.id;

                if (vehicleTypeId === 5) {
                    this.isTruckSelectedArr[i] = false;
                    this.isBoxTruckSelectedArr[i] = false;

                    this.inputService.changeValidators(
                        this.classesOfEquipment.at(i).get('trailerType'),
                        false
                    );

                    this.inputService.changeValidators(
                        this.classesOfEquipment.at(i).get('trailerLength'),
                        false
                    );
                } else if (vehicleTypeId === 2) {
                    this.isTruckSelectedArr[i] = true;
                    this.isBoxTruckSelectedArr[i] = true;

                    this.filteredLengthTypeArr[i] = this.boxTruckLengthType;

                    this.inputService.changeValidators(
                        this.classesOfEquipment.at(i).get('trailerType'),
                        false
                    );
                } else if (vehicleTypeId === 4) {
                    this.isTruckSelectedArr[i] = true;
                    this.isBoxTruckSelectedArr[i] = false;

                    this.filteredLengthTypeArr[i] = this.trailerLengthType;

                    this.filteredTrailerTypeArr[i] = this.trailerType.filter(
                        (item) => item.id === 14
                    );
                } else {
                    this.isTruckSelectedArr[i] = true;
                    this.isBoxTruckSelectedArr[i] = false;

                    this.filteredLengthTypeArr[i] = this.trailerLengthType;

                    this.filteredTrailerTypeArr[i] = this.trailerType.filter(
                        (item) => item.id !== 14
                    );
                }
            }
        } else {
            if (!this.classesOfEquipment.controls.length) {
                this.classesOfEquipment.push(this.createClassOfEquipment());
            }
        }
    }

    private createClassOfEquipment(): UntypedFormGroup {
        this.displaySwitchCfrPartRequiredStateArray = [
            ...this.displaySwitchCfrPartRequiredStateArray,
            false,
        ];
        this.displaySwitchFmcsaRequiredStateArray = [
            ...this.displaySwitchFmcsaRequiredStateArray,
            false,
        ];

        return this.formBuilder.group({
            vehicleType: [null, Validators.required],
            trailerType: [null, Validators.required],
            trailerLength: [null, Validators.required],
            cfrPart: [null, Validators.required],
            fmcsa: [null, Validators.required],
        });
    }

    public onAddClassOfEquipment(): void {
        if (this.classesOfEquipment.invalid) {
            this.classesOfEquipment.controls.forEach((_, index) => {
                this.inputService.markInvalid(
                    this.classesOfEquipment.at(index) as UntypedFormGroup
                );

                if (this.classesOfEquipment.at(index).get('cfrPart').invalid) {
                    if (index === 0) {
                        return;
                    }

                    this.displaySwitchCfrPartRequiredStateArray[index] = true;
                }

                if (this.classesOfEquipment.at(index).get('fmcsa').invalid) {
                    if (index === 0) {
                        return;
                    }

                    this.displaySwitchFmcsaRequiredStateArray[index] = true;
                }
            });

            if (this.classesOfEquipment?.length === 1) {
                const cfrPartRadios: any = this.classesOfEquipment
                    .at(0)
                    .get('cfrPart').value;

                const fmcsaRadios: any = this.classesOfEquipment
                    .at(0)
                    .get('cfrPart').value;

                if (cfrPartRadios === null) {
                    this.radioRequiredNoteEmitter.emit({
                        id: 0,
                        displayRadioRequiredNote: true,
                    });
                }

                if (fmcsaRadios === null) {
                    this.radioRequiredNoteEmitter.emit({
                        id: 1,
                        displayRadioRequiredNote: true,
                    });
                }
            }

            return;
        }

        this.classesOfEquipment.push(this.createClassOfEquipment());
    }

    public onDeleteClassOfEquipment(index: number): void {
        this.classesOfEquipment.removeAt(index);

        this.selectedVehicleTypeArr.splice(index, 1);
        this.selectedTrailerTypeArr.splice(index, 1);
        this.selectedTrailerLengthArr.splice(index, 1);

        this.isTruckSelectedArr.splice(index, 1);
        this.isBoxTruckSelectedArr.splice(index, 1);

        this.filteredTrailerTypeArr.splice(index, 1);
        this.filteredLengthTypeArr.splice(index, 1);
    }

    public handleInputSelect(
        event: any,
        action: string,
        formGroupIndex?: number,
        type?: string
    ): void {
        const inputsToValidate = [
            'vehicleType',
            'trailerType',
            'trailerLength',
            'employerAddress',
            'cfrPart',
            'fmcsa',
        ];

        switch (action) {
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.workExperienceForm
                        .get(inputsToValidate[3])
                        .setErrors({ invalid: true });
                }

                break;
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedVehicleTypeArr[formGroupIndex] = event;

                if (event) {
                    this.isTruckSelectedArr[formGroupIndex] = true;
                    this.isBoxTruckSelectedArr[formGroupIndex] = false;

                    this.selectedTrailerTypeArr[formGroupIndex] = null;
                    this.selectedTrailerLengthArr[formGroupIndex] = null;

                    this.filteredTrailerTypeArr[formGroupIndex] =
                        this.trailerType.filter((item) => item.id !== 14);
                    this.filteredLengthTypeArr[formGroupIndex] =
                        this.trailerLengthType;

                    this.classesOfEquipment.at(formGroupIndex).patchValue({
                        vehicleType: event.name,
                        trailerType: null,
                        trailerLength: null,
                    });

                    for (let i = 0; i < 3; i++) {
                        this.inputService.changeValidators(
                            this.classesOfEquipment
                                .at(formGroupIndex)
                                .get(inputsToValidate[i])
                        );
                    }

                    switch (event.id) {
                        case 2:
                            this.isBoxTruckSelectedArr[formGroupIndex] = true;

                            this.filteredLengthTypeArr[formGroupIndex] =
                                this.boxTruckLengthType;

                            this.inputService.changeValidators(
                                this.classesOfEquipment
                                    .at(formGroupIndex)
                                    .get(inputsToValidate[1]),
                                false
                            );

                            break;

                        case 4:
                            this.filteredTrailerTypeArr[formGroupIndex] =
                                this.trailerType.filter(
                                    (item) => item.id === 14
                                );

                            break;
                        case 5:
                            this.isTruckSelectedArr[formGroupIndex] = false;

                            this.inputService.changeValidators(
                                this.classesOfEquipment
                                    .at(formGroupIndex)
                                    .get(inputsToValidate[1]),
                                false
                            );

                            this.inputService.changeValidators(
                                this.classesOfEquipment
                                    .at(formGroupIndex)
                                    .get(inputsToValidate[2]),
                                false
                            );

                            break;

                        default:
                            break;
                    }
                } else {
                    this.selectedVehicleTypeArr[formGroupIndex] = null;
                    this.selectedTrailerTypeArr[formGroupIndex] = null;
                    this.selectedTrailerLengthArr[formGroupIndex] = null;

                    this.isTruckSelectedArr[formGroupIndex] = false;
                    this.isBoxTruckSelectedArr[formGroupIndex] = false;

                    this.classesOfEquipment.at(formGroupIndex).patchValue({
                        vehicleType: null,
                        trailerType: null,
                        trailerLength: null,
                    });
                }

                break;
            case InputSwitchActions.TRAILER_TYPE:
                this.selectedTrailerTypeArr[formGroupIndex] = event;

                if (event) {
                    this.classesOfEquipment
                        .at(formGroupIndex)
                        .get('trailerType')
                        .patchValue(event.name);
                }

                break;
            case InputSwitchActions.TRAILER_LENGTH:
                this.selectedTrailerLengthArr[formGroupIndex] = event;

                if (event) {
                    this.classesOfEquipment
                        .at(formGroupIndex)
                        .get('trailerLength')
                        .patchValue(event.name);
                }

                break;
            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName =
                    this.questions[selectedCheckbox.index].formControlName;

                if (selectedCheckbox.label === 'YES') {
                    this.classesOfEquipment
                        .at(formGroupIndex)
                        .get(selectedFormControlName)
                        .patchValue(true);
                } else {
                    this.classesOfEquipment
                        .at(formGroupIndex)
                        .get(selectedFormControlName)
                        .patchValue(false);
                }

                this.radioRequiredNoteEmitter.emit({
                    id: selectedCheckbox.index,
                    displayRadioRequiredNote: false,
                });

                break;
            case InputSwitchActions.REASON_FOR_LEAVING:
                this.selectedReasonForLeaving = event;

                break;
            case InputSwitchActions.SWITCH:
                if (type === inputsToValidate[4]) {
                    if (event) {
                        this.classesOfEquipment
                            .at(formGroupIndex)
                            .get(inputsToValidate[4])
                            .patchValue(true);
                    } else {
                        this.classesOfEquipment
                            .at(formGroupIndex)
                            .get(inputsToValidate[4])
                            .patchValue(false);
                    }

                    this.displaySwitchCfrPartRequiredStateArray[
                        formGroupIndex
                    ] = false;
                }

                if (type === inputsToValidate[5]) {
                    if (event) {
                        this.classesOfEquipment
                            .at(formGroupIndex)
                            .get(inputsToValidate[5])
                            .patchValue(true);
                    } else {
                        this.classesOfEquipment
                            .at(formGroupIndex)
                            .get(inputsToValidate[5])
                            .patchValue(false);
                    }

                    this.displaySwitchFmcsaRequiredStateArray[formGroupIndex] =
                        false;
                }

                break;
            default:
                break;
        }
    }

    public onGetBtnClickValue(event: any, classOfEquipmentBtn?: boolean): void {
        if (classOfEquipmentBtn) {
            this.onAddClassOfEquipment();
        } else {
            if (event.notDisabledClick) {
                this.onAddSecondOrLastEmployer();
            }

            if (event.cancelClick) {
                this.onCancelEditWorkExperience();
            }

            if (event.saveClick) {
                this.onSaveEditedWorkExperience();
            }

            if (event.reviewCancelClick) {
                this.onCancelReviewWorkExperience();
            }

            if (event.reviewSaveClick) {
                this.onAddAnnotation();
            }
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

                this.trailerType = res.trailerTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trailers',
                    };
                });

                this.trailerLengthType = res.trailerLenghts;
                this.boxTruckLengthType = res.truckLengths;

                this.reasonsForLeaving = res.reasonsForLeave;
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
                    case 20:
                        this.workExperienceForm
                            .get('firstRowReview')
                            .patchValue(null);

                        break;
                    case 21:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('secondRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 22:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('thirdRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 23:
                        if (!isAnyInputInLineIncorrect) {
                            this.workExperienceForm
                                .get('fourthRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 26:
                        this.workExperienceForm
                            .get('seventhRowReview')
                            .patchValue(null);

                        break;

                    default:
                        break;
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

            this.openAnnotationArrayValuesEmitter.emit(
                filteredOpenAnnotationArray
            );
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

    public onCancelReviewWorkExperience(): void {
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

    /* CHECK CHECK CHECK */

    public patchForm(formValue: any): void {
        if (this.selectedMode === SelectedMode.REVIEW) {
            if (
                formValue.workExperienceItemReview &&
                Object.keys(formValue.workExperienceItemReview).length > 5
            ) {
                const {
                    isEmployerValid,
                    employerMessage,
                    isJobDescriptionValid,
                    isFromValid,
                    isToValid,
                    jobDescriptionMessage,
                    isPhoneValid,
                    isEmailValid,
                    isFaxValid,
                    contactMessage,
                    isAddressValid,
                    isAddressUnitValid,
                    addressMessage,
                    isAccountForPeriodBetweenValid,
                    accountForPeriodBetweenMessage,
                } = formValue.workExperienceItemReview;

                this.openAnnotationArray[20] = {
                    ...this.openAnnotationArray[20],
                    lineInputs: [!isEmployerValid],
                    displayAnnotationButton:
                        !isEmployerValid && !employerMessage ? true : false,
                    displayAnnotationTextArea: employerMessage ? true : false,
                };
                this.openAnnotationArray[21] = {
                    ...this.openAnnotationArray[21],
                    lineInputs: [
                        !isJobDescriptionValid,
                        !isFromValid,
                        !isToValid,
                    ],
                    displayAnnotationButton:
                        (!isJobDescriptionValid ||
                            !isFromValid ||
                            !isToValid) &&
                        !jobDescriptionMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: jobDescriptionMessage
                        ? true
                        : false,
                };
                this.openAnnotationArray[22] = {
                    ...this.openAnnotationArray[22],
                    lineInputs: [!isPhoneValid, !isEmailValid, !isFaxValid],
                    displayAnnotationButton:
                        (!isPhoneValid || !isEmailValid || !isFaxValid) &&
                        !contactMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: contactMessage ? true : false,
                };
                this.openAnnotationArray[23] = {
                    ...this.openAnnotationArray[23],
                    lineInputs: [!isAddressValid, !isAddressUnitValid],
                    displayAnnotationButton:
                        (!isAddressValid || !isAddressUnitValid) &&
                        !addressMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: addressMessage ? true : false,
                };
                this.openAnnotationArray[26] = {
                    ...this.openAnnotationArray[26],
                    lineInputs: [!isAccountForPeriodBetweenValid],
                    displayAnnotationButton:
                        !isAccountForPeriodBetweenValid &&
                        !accountForPeriodBetweenMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: accountForPeriodBetweenMessage
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

                this.workExperienceForm.patchValue({
                    firstRowReview: employerMessage,
                    secondRowReview: jobDescriptionMessage,
                    thirdRowReview: contactMessage,
                    fourthRowReview: addressMessage,
                    seventhRowReview: accountForPeriodBetweenMessage,
                });
            }
        }

        this.workExperienceForm.patchValue({
            employer: formValue?.employer,
            employerPhone: formValue?.employerPhone,
            employerEmail: formValue?.employerEmail,
            employerFax: formValue?.employerFax,
            employerAddress: formValue?.employerAddress
                ? formValue?.employerAddress?.address
                : null,
            employerAddressUnit: formValue?.employerAddressUnit,
            jobDescription: formValue?.jobDescription,
            fromDate: formValue?.fromDate,
            toDate: formValue?.toDate,
            reasonForLeaving: formValue?.reasonForLeaving,
            accountForPeriod: formValue?.accountForPeriod,
            isDrivingPosition: formValue?.isDrivingPosition,
            currentEmployment: formValue?.currentEmployment,
        });

        this.selectedAddress = formValue?.employerAddress;

        setTimeout(() => {
            this.selectedReasonForLeaving = this.reasonsForLeaving.find(
                (item) => item.name === formValue?.reasonForLeaving
            );
        }, 50);

        if (formValue?.isDrivingPosition) {
            this.patchClassOfEquipment(formValue.classesOfEquipment);
        }
    }

    public startValueChangesMonitoring(): void {
        this.subscription = this.workExperienceForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((updatedFormValues) => {
                const {
                    id,
                    reviewId,
                    employerAddress,
                    applicantId,
                    isEditingWorkExperience,
                    fromDate,
                    toDate,
                    workExperienceItemReview,
                    classesOfEquipment,
                    ...previousFormValues
                } = this.formValuesToPatch;

                previousFormValues.fromDate = moment(new Date(fromDate)).format(
                    'MM/DD/YY'
                );
                previousFormValues.toDate = moment(new Date(toDate)).format(
                    'MM/DD/YY'
                );

                previousFormValues.employerAddress = employerAddress?.address;

                this.editingCardAddress = employerAddress;

                previousFormValues.classesOfEquipment = JSON.stringify(
                    updatedFormValues.isDrivingPosition
                        ? classesOfEquipment
                        : []
                );

                const {
                    employerAddress: newEmployerAddress,
                    vehicleType: updatedVehicleType,
                    trailerType: updatedTrailerType,
                    trailerLength,
                    firstRowReview,
                    secondRowReview,
                    thirdRowReview,
                    fourthRowReview,
                    fifthRowReview: updatedFifthRowReview,
                    sixthRowReview,
                    seventhRowReview,
                    classesOfEquipment: updatedClassesOfEquipment,
                    ...newFormValues
                } = updatedFormValues;

                newFormValues.employerAddress = newEmployerAddress?.address;

                newFormValues.classesOfEquipment = JSON.stringify(
                    updatedClassesOfEquipment
                );

                if (isFormValueEqual(previousFormValues, newFormValues)) {
                    this.isWorkExperienceEdited = false;
                } else {
                    this.isWorkExperienceEdited = true;
                }
            });
    }

    public onAddSecondOrLastEmployer(): void {
        if (this.workExperienceForm.invalid) {
            this.inputService.markInvalid(this.workExperienceForm);
            return;
        }

        const {
            vehicleType,
            trailerType,
            trailerLength,
            employerAddress,
            employerAddressUnit,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            classesOfEquipment,
            ...workExperienceForm
        } = this.workExperienceForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: employerAddressUnit,
        };

        const saveData: WorkExpereience = {
            ...workExperienceForm,
            employerAddress: selectedAddress,
            employerAddressUnit,
            isEditingWorkExperience: false,
            classesOfEquipment: classesOfEquipment.map((classOfEquipment) => {
                return {
                    ...classOfEquipment,
                    vehicleTypeLogoName: this.vehicleType.find(
                        (item) => item.name === classOfEquipment.vehicleType
                    ).logoName,
                    trailerTypeLogoName: classOfEquipment.trailerType
                        ? this.trailerType.find(
                              (item) =>
                                  item.name === classOfEquipment.trailerType
                          ).logoName
                        : null,
                };
            }),
        };

        this.formValuesEmitter.emit(saveData);

        this.selectedAddress = null;
        this.selectedVehicleTypeArr = [];
        this.selectedTrailerTypeArr = [];
        this.selectedTrailerLengthArr = [];
        this.selectedReasonForLeaving = null;

        this.classesOfEquipment.clear();

        this.formService.resetForm(this.workExperienceForm);
    }

    public onCancelEditWorkExperience(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isWorkExperienceEdited = false;

        this.formStatusEmitter.emit('VALID');

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onSaveEditedWorkExperience(): void {
        if (this.workExperienceForm.invalid || !this.isWorkExperienceEdited) {
            if (this.workExperienceForm.invalid) {
                this.inputService.markInvalid(this.workExperienceForm);
            }

            return;
        }

        const {
            vehicleType,
            trailerType,
            trailerLength,
            employerAddress,
            employerAddressUnit,
            classesOfEquipment,
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            ...workExperienceForm
        } = this.workExperienceForm.value;

        const selectedAddress = {
            ...this.selectedAddress,
            addressUnit: employerAddressUnit,
        };

        const saveData: WorkExpereience = {
            ...workExperienceForm,
            employerAddress: this.selectedAddress
                ? selectedAddress
                : this.editingCardAddress,
            employerAddressUnit,
            isEditingWorkExperience: false,
            classesOfEquipment: classesOfEquipment.map((classOfEquipment) => {
                return {
                    ...classOfEquipment,
                    vehicleTypeLogoName: this.vehicleType.find(
                        (item) => item.name === classOfEquipment.vehicleType
                    ).logoName,
                    trailerTypeLogoName: classOfEquipment.trailerType
                        ? this.trailerType.find(
                              (item) =>
                                  item.name === classOfEquipment.trailerType
                          ).logoName
                        : null,
                };
            }),
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isWorkExperienceEdited = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onDeleteWorkExperience(): void {
        this.onDeleteWorkExperienceClick.emit(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
