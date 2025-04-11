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
    UntypedFormGroup,
    UntypedFormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
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

// services
import { FormService } from '@shared/services/form.service';
import { TaInputService } from '@shared/services/ta-input.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// helpers
import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';

// enums
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import {
    eFileFormControls,
    eGeneralActions,
    eStringPlaceholder,
} from '@shared/enums';

// routes
import { ApplicantSvgRoutes } from '@pages/applicant/utils/helpers/applicant-svg-routes';

// models
import { License } from '@pages/applicant/pages/applicant-application/models/license.model';
import {
    ApplicantModalResponse,
    CdlEndorsementResponse,
    CdlRestrictionResponse,
    EnumValue,
} from 'appcoretruckassist/model/models';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// components
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SharedModule } from '@shared/shared.module';

// configs
import { Step3Config } from '@pages/applicant/pages/applicant-application/components/step3/config/step3.config';

@Component({
    selector: 'app-step3-form',
    templateUrl: './step3-form.component.html',
    styleUrls: ['./step3-form.component.scss'],
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
        TaUploadFilesComponent,
        TaCounterComponent,
    ],
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
    @Output() onDeleteCdlClick = new EventEmitter<boolean>();

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

    public applicantSvgRoutes = ApplicantSvgRoutes;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService,
        private applicantQuery: ApplicantQuery
    ) {}

    get licenseNumberInputConfig(): ITaInput {
        return Step3Config.getLicenseNumberInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get countryInputConfig(): ITaInput {
        return Step3Config.getCountryInputConfig({
            selectedMode: this.selectedMode,
            isEditing: this.isEditing,
        });
    }

    get stateInputConfig(): ITaInput {
        return Step3Config.getStateInputConfig({
            selectedMode: this.selectedMode,
            licenseForm: this.licenseForm,
            isEditing: this.isEditing,
        });
    }

    get classTypeInputConfig(): ITaInput {
        return Step3Config.getClassTypeInputConfig({
            selectedMode: this.selectedMode,
        });
    }

    get issueDateInputConfig(): ITaInput {
        return Step3Config.getIssueDateInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get expDateInputConfig(): ITaInput {
        return Step3Config.getExpDateInputConfig({
            selectedMode: this.selectedMode,
            stepFeedbackValues: this.stepFeedbackValues,
        });
    }

    get restrictionsInputConfig(): ITaInput {
        return Step3Config.getRestrictionsInputConfig({
            selectedMode: this.selectedMode,
            isEditing: this.isEditing,
        });
    }

    get endorsmentsInputConfig(): ITaInput {
        return Step3Config.getEndorsmentsInputConfig({
            selectedMode: this.selectedMode,
            isEditing: this.isEditing,
        });
    }

    get permitExplainInputConfig(): ITaInput {
        return Step3Config.getPermitExplainInputConfig({
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
                    res.documents = this.documents;
                    if (
                        this.documentsForDeleteIds.length &&
                        this.documentsForDeleteIds[0]
                    )
                        res.filesForDeleteIds = this.documentsForDeleteIds;

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
        )
            setTimeout(() => {
                this.patchForm(changes.formValuesToPatch.currentValue);

                if (this.selectedMode !== SelectedMode.REVIEW) {
                    this.startValueChangesMonitoring();
                }
            }, 50);
    }

    private createForm(): void {
        this.licenseForm = this.formBuilder.group({
            licenseNumber: [null, Validators.required],
            country: [null, Validators.required],
            state: [null, Validators.required],
            classType: [null, Validators.required],
            expDate: [null, Validators.required],
            issueDate: [null, Validators.required],
            restrictions: [null],
            endorsments: [null],
            restrictionsSubscription: [null],
            endorsmentsSubscription: [null],
            files: [null, Validators.required],

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
            issueDate: formValue?.issueDate,
            files: JSON.stringify(formValue?.files),
        });

        setTimeout(() => {
            if (formValue.country?.toLowerCase() === 'us')
                this.stateTypes = this.usStates;
            else this.stateTypes = this.canadaStates;

            if (formValue?.documents) this.documents = formValue?.documents;

            if (formValue?.filesForDeleteIds)
                this.documentsForDeleteIds = formValue.filesForDeleteIds;

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
                        .concat(
                            eStringPlaceholder.WHITESPACE,
                            eStringPlaceholder.DASH
                        )
                        .concat(
                            eStringPlaceholder.WHITESPACE,
                            item.description
                        ),
                };
            });

            this.selectedEndorsments = formValue?.endorsments?.map((item) => {
                return {
                    ...item,
                    name: item.code
                        .concat(
                            eStringPlaceholder.WHITESPACE,
                            eStringPlaceholder.DASH
                        )
                        .concat(
                            eStringPlaceholder.WHITESPACE,
                            item.description
                        ),
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
                    issueDate,
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

                previousFormValues.issueDate = moment(
                    new Date(issueDate)
                ).format('MM/DD/YY');
                previousFormValues.issueDate = moment(
                    new Date(issueDate)
                ).format('MM/DD/YY');

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

    public onFilesAction(fileActionEvent: {
        files: File[];
        action: eGeneralActions.ADD | eGeneralActions.DELETE_LOWERCASE;
        deleteId?: number;
    }): void {
        this.documents = fileActionEvent.files;

        this.displayDocumentsRequiredNote = false;

        switch (fileActionEvent.action) {
            case eGeneralActions.ADD:
                this.licenseForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(fileActionEvent.files));
                break;
            case eGeneralActions.DELETE_LOWERCASE:
                this.licenseForm
                    .get(eFileFormControls.FILES)
                    .patchValue(
                        fileActionEvent.files.length
                            ? JSON.stringify(fileActionEvent.files)
                            : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    fileActionEvent.deleteId,
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

        const saveData: License = {
            ...licenseForm,
            state: this.selectedStateType.stateName,
            stateShort: this.selectedStateType.name,
            restrictions: this.selectedRestrictions,
            endorsments: this.selectedEndorsments,
            restrictionsCode: this.selectedRestrictions
                ? this.selectedRestrictions
                      .map((resItem) => resItem.code)
                      .join(', ')
                : [],
            endorsmentsCode: this.selectedEndorsments
                ? this.selectedEndorsments
                      .map((resItem) => resItem.code)
                      .join(', ')
                : [],
            isEditingLicense: false,
            documents: this.documents,
            ...(this.documentsForDeleteIds.length &&
                this.documentsForDeleteIds[0] && {
                    filesForDeleteIds: this.documentsForDeleteIds,
                }),
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

        const saveData: License = {
            ...licenseForm,
            state: this.selectedStateType.stateName,
            stateShort: this.selectedStateType.name,
            restrictions: this.selectedRestrictions,
            endorsments: this.selectedEndorsments,
            restrictionsCode: this.selectedRestrictions
                ? this.selectedRestrictions
                      .map((resItem) => resItem.code)
                      .join(', ')
                : [],
            endorsmentsCode: this.selectedEndorsments
                ? this.selectedEndorsments
                      .map((resItem) => resItem.code)
                      .join(', ')
                : [],
            isEditingLicense: false,
            documents: this.documents,
            ...(this.documentsForDeleteIds.length &&
                this.documentsForDeleteIds[0] && {
                    filesForDeleteIds: this.documentsForDeleteIds,
                }),
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
                            .concat(
                                eStringPlaceholder.WHITESPACE,
                                eStringPlaceholder.DASH
                            )
                            .concat(
                                eStringPlaceholder.WHITESPACE,
                                item.description
                            ),
                    };
                });

                this.endorsmentsList = res.endorsements.map((item) => {
                    return {
                        ...item,
                        name: item.code
                            .concat(
                                eStringPlaceholder.WHITESPACE,
                                eStringPlaceholder.DASH
                            )
                            .concat(
                                eStringPlaceholder.WHITESPACE,
                                item.description
                            ),
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

    public onDeleteCdl(): void {
        this.onDeleteCdlClick.emit(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
