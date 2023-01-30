/* eslint-disable no-unused-vars */

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
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {
    Subscription,
    Subject,
    takeUntil,
    distinctUntilChanged,
    throttleTime,
} from 'rxjs';

import moment from 'moment';

import { FormService } from './../../../../services/form/form.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '../../state/utils/utils';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { LicenseModel } from '../../state/model/cdl-information';
import {
    ApplicantModalResponse,
    CdlEndorsementResponse,
    CdlRestrictionResponse,
    EnumValue,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step3-form',
    templateUrl: './step3-form.component.html',
    styleUrls: ['./step3-form.component.scss'],
})
export class Step3FormComponent
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

    private destroy$ = new Subject<void>();

    public selectedMode = SelectedMode.APPLICANT;

    private subscription: Subscription;

    public licenseForm: UntypedFormGroup;

    public isLicenseEdited: boolean;

    public canadaStates: any[] = [];
    public usStates: any[] = [];

    public countryTypes: EnumValue[] = [];
    public stateTypes: any[] = [];
    public classTypes: EnumValue[] = [];
    public restrictionsList: CdlRestrictionResponse[] = [];
    public endorsmentsList: CdlEndorsementResponse[] = [];

    public selectedCountryType: EnumValue = null;
    public selectedStateType: any = null;
    public selectedClassType: EnumValue = null;
    public selectedRestrictions: CdlRestrictionResponse[] = [];
    public selectedEndorsments: CdlEndorsementResponse[] = [];

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

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
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public isCardReviewedIncorrect: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();
    }

    ngAfterViewInit(): void {
        if (this.selectedMode !== SelectedMode.REVIEW) {
            this.licenseForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.licenseForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    res.state = this.selectedStateType?.stateName;
                    res.stateShort = this.selectedStateType?.name;

                    res.restrictions = this.selectedRestrictions;
                    res.endorsments = this.selectedEndorsments;

                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.licenseForm.valueChanges
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
                this.inputService.markInvalid(this.licenseForm);
                this.markInvalidEmitter.emit(false);
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

    private createForm(): void {
        this.licenseForm = this.formBuilder.group({
            licenseNumber: [null, Validators.required],
            country: [null, Validators.required],
            state: [null, Validators.required],
            classType: [null, Validators.required],
            expDate: [null, Validators.required],
            restrictions: [null],
            endorsments: [null],
            restrictionsSubscription: [null],
            endorsmentsSubscription: [null],
            /*  files: [null, Validators.required], */

            firstRowReview: [null],
            secondRowReview: [null],
        });
    }

    public patchForm(formValue: any): void {
        if (this.selectedMode === SelectedMode.REVIEW) {
            if (
                formValue.licenseReview &&
                Object.keys(formValue.licenseReview).length > 2
            ) {
                const {
                    isLicenseValid,
                    licenseMessage,
                    isExpDateValid,
                    expDateMessage,
                } = formValue.licenseReview;

                this.openAnnotationArray[10] = {
                    ...this.openAnnotationArray[10],
                    lineInputs: [!isLicenseValid, false],
                    displayAnnotationButton:
                        !isLicenseValid && !licenseMessage ? true : false,
                    displayAnnotationTextArea: licenseMessage ? true : false,
                };
                this.openAnnotationArray[11] = {
                    ...this.openAnnotationArray[11],
                    lineInputs: [false, false, !isExpDateValid],
                    displayAnnotationButton:
                        !isExpDateValid && !expDateMessage ? true : false,
                    displayAnnotationTextArea: expDateMessage ? true : false,
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

                this.licenseForm.patchValue({
                    firstRowReview: licenseMessage,
                    secondRowReview: expDateMessage,
                });
            }
        }

        this.licenseForm.patchValue({
            licenseNumber: formValue?.licenseNumber,
            country: formValue?.country,
            state: formValue?.stateShort ?? null,
            classType: formValue?.classType,
            expDate: formValue?.expDate,
        });

        setTimeout(() => {
            if (formValue.country?.toLowerCase() === 'us') {
                this.stateTypes = this.usStates;
            } else {
                this.stateTypes = this.canadaStates;
            }

            this.selectedCountryType = this.countryTypes.find(
                (item) => item.name === formValue?.country
            );

            const filteredStateType = this.usStates.find(
                (stateItem) => stateItem.name === formValue?.stateShort
            );

            this.selectedStateType = filteredStateType
                ? filteredStateType
                : this.canadaStates.find(
                      (stateItem) => stateItem.name === formValue?.stateShort
                  );

            this.selectedClassType = this.classTypes.find(
                (item) => item.name === formValue?.classType
            );

            this.selectedRestrictions = formValue?.restrictions?.map((item) => {
                return {
                    ...item,
                    name: item.code
                        .concat(' ', '-')
                        .concat(' ', item.description),
                };
            });

            this.selectedEndorsments = formValue?.endorsments?.map((item) => {
                return {
                    ...item,
                    name: item.code
                        .concat(' ', '-')
                        .concat(' ', item.description),
                };
            });
        }, 50);
    }

    public startValueChangesMonitoring(): void {
        this.subscription = this.licenseForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((updatedFormValues) => {
                const {
                    isEditingLicense,
                    licenseReview,
                    expDate,
                    id,
                    reviewId,
                    restrictionsCode,
                    endorsmentsCode,
                    ...previousFormValues
                } = this.formValuesToPatch;

                const {
                    restrictions,
                    endorsments,
                    restrictionsSubscription,
                    endorsmentsSubscription,
                    firstRowReview,
                    secondRowReview,
                    ...newFormValues
                } = updatedFormValues;

                previousFormValues.expDate = moment(new Date(expDate)).format(
                    'MM/DD/YY'
                );

                previousFormValues.licenseNumber =
                    previousFormValues.licenseNumber?.toUpperCase();
                newFormValues.licenseNumber =
                    newFormValues.licenseNumber?.toUpperCase();

                previousFormValues.restrictions = JSON.stringify(
                    previousFormValues.restrictions?.map((item) => item.id)
                );
                newFormValues.restrictions = JSON.stringify(
                    restrictionsSubscription
                        ? restrictionsSubscription?.map((item) => item.id)
                        : []
                );

                previousFormValues.endorsments = JSON.stringify(
                    previousFormValues.endorsments?.map((item) => item.id)
                );
                newFormValues.endorsments = JSON.stringify(
                    endorsmentsSubscription
                        ? endorsmentsSubscription?.map((item) => item.id)
                        : []
                );

                if (isFormValueEqual(previousFormValues, newFormValues)) {
                    this.isLicenseEdited = false;
                } else {
                    this.isLicenseEdited = true;
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.COUNTRY_TYPE:
                const previousSelectedCountry = this.selectedCountryType;

                this.selectedCountryType = event;

                if (this.selectedCountryType !== previousSelectedCountry) {
                    this.selectedStateType = null;

                    this.licenseForm.patchValue({
                        state: null,
                    });
                }

                if (this.selectedCountryType?.name.toLowerCase() === 'us') {
                    this.stateTypes = this.usStates;
                } else {
                    this.stateTypes = this.canadaStates;
                }

                break;
            case InputSwitchActions.STATE_TYPE:
                this.selectedStateType = event;

                break;
            case InputSwitchActions.CLASS_TYPE:
                this.selectedClassType = event;

                break;
            case InputSwitchActions.RESTRICTIONS:
                this.selectedRestrictions = event;

                this.licenseForm
                    .get('restrictionsSubscription')
                    .patchValue(this.selectedRestrictions);

                break;
            case InputSwitchActions.ENDORSMENTS:
                this.selectedEndorsments = event;

                this.licenseForm
                    .get('endorsmentsSubscription')
                    .patchValue(this.selectedEndorsments);

                break;
            default:
                break;
        }
    }

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case 'add':
                this.licenseForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.licenseForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    event.deleteId,
                ];

                break;

            default:
                break;
        }
    }

    public onAddLicense(): void {
        if (this.licenseForm.invalid) {
            this.inputService.markInvalid(this.licenseForm);
            return;
        }

        const {
            state,
            restrictions,
            endorsments,
            restrictionsSubscription,
            endorsmentsSubscription,
            firstRowReview,
            secondRowReview,
            ...licenseForm
        } = this.licenseForm.value;

        const saveData: LicenseModel = {
            ...licenseForm,
            state: this.selectedStateType.stateName,
            stateShort: this.selectedStateType.name,
            restrictions: this.selectedRestrictions,
            endorsments: this.selectedEndorsments,
            restrictionsCode: this.selectedRestrictions
                .map((resItem) => resItem.code)
                .join(', '),
            endorsmentsCode: this.selectedEndorsments
                .map((resItem) => resItem.code)
                .join(', '),
            isEditingLicense: false,
        };

        this.formValuesEmitter.emit(saveData);

        this.selectedCountryType = null;
        this.selectedStateType = null;
        this.selectedClassType = null;
        this.selectedEndorsments = [];
        this.selectedRestrictions = [];

        this.formService.resetForm(this.licenseForm);
    }

    public onCancelEditLicense(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isLicenseEdited = false;

        this.formStatusEmitter.emit('VALID');

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onSaveEditedLicense(): void {
        if (this.licenseForm.invalid || !this.isLicenseEdited) {
            if (this.licenseForm.invalid) {
                this.inputService.markInvalid(this.licenseForm);
            }

            return;
        }

        const {
            state,
            restrictions,
            endorsments,
            restrictionsSubscription,
            endorsmentsSubscription,
            firstRowReview,
            secondRowReview,
            ...licenseForm
        } = this.licenseForm.value;

        const saveData: LicenseModel = {
            ...licenseForm,
            state: this.selectedStateType.stateName,
            stateShort: this.selectedStateType.name,
            restrictions: this.selectedRestrictions,
            endorsments: this.selectedEndorsments,
            restrictionsCode: this.selectedRestrictions
                .map((resItem) => resItem.code)
                .join(', '),
            endorsmentsCode: this.selectedEndorsments
                .map((resItem) => resItem.code)
                .join(', '),
            isEditingLicense: false,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isLicenseEdited = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.onAddLicense();
        }

        if (event.cancelClick) {
            this.onCancelEditLicense();
        }

        if (event.saveClick) {
            this.onSaveEditedLicense();
        }

        if (event.reviewCancelClick) {
            this.onCancelReviewLicense();
        }

        if (event.reviewSaveClick) {
            this.onAddAnnotation();
        }
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

                this.restrictionsList = res.restrictions.map((item) => {
                    return {
                        ...item,
                        name: item.code
                            .concat(' ', '-')
                            .concat(' ', item.description),
                    };
                });

                this.endorsmentsList = res.endorsements.map((item) => {
                    return {
                        ...item,
                        name: item.code
                            .concat(' ', '-')
                            .concat(' ', item.description),
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
                            this.licenseForm
                                .get('firstRowReview')
                                .patchValue(null);
                        }

                        break;
                    case 11:
                        if (!isAnyInputInLineIncorrect) {
                            this.licenseForm
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

    public onCancelReviewLicense(): void {
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
