import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, Subject, takeUntil } from 'rxjs';

// helpers
import { anyInputInLineIncorrect } from '@pages/applicant/utils/helpers/applicant.helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';
import { ApplicantStore } from '@pages/applicant/state/applicant.store';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';
import {
    EFileFormControls,
    eGeneralActions,
    eStringPlaceholder,
} from '@shared/enums';

// models
import {
    ApplicantResponse,
    CreateMvrAuthReviewCommand,
    CreateWithUploadsResponse,
    MvrAuthFeedbackResponse,
} from 'appcoretruckassist';
import { License } from '@pages/applicant/pages/applicant-application/models/license.model';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { ApplicantLicensesTableComponent } from '@pages/applicant/components/applicant-licenses-table/applicant-licenses-table.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

@Component({
    selector: 'app-mvr-authorization',
    templateUrl: './applicant-mvr-authorization.component.html',
    styleUrls: ['./applicant-mvr-authorization.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaUploadFilesComponent,
        TaCheckboxComponent,
        TaCounterComponent,
        ApplicantLicensesTableComponent,
        ApplicantNextBackBtnComponent,
    ],
})
export class ApplicantMvrAuthorizationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public isValidLoad: boolean;

    public mvrAuthorizationForm: UntypedFormGroup;
    public dontHaveMvrForm: UntypedFormGroup;

    public applicantId: number;
    public mvrAuthId: number | null = null;
    public queryParamId: number | string | null = null;

    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public licenses: License[] = [];

    public previousStepValues: any;

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {
            lineIndex: 0,
            lineInputs: [],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public hasIncorrectFields: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService,
        private imageBase64Service: ImageBase64Service,
        private route: ActivatedRoute
    ) {}

    get issueDateInputConfig() {
        return {
            name: 'datepicker',
            type: 'text',
            label: 'Issue date',
            isDropdown: true,
            placeholderIcon: 'date',
            isRequired: true,
            customClass: 'datetimeclass',
            isDisabled: this.selectedMode === SelectedMode.REVIEW,
            incorrectInput: this.selectedMode === SelectedMode.REVIEW,
        };
    }

    ngOnInit(): void {
        this.initMode();

        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();

        this.requestDrivingRecordFromEmployer();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.mvrAuthorizationForm = this.formBuilder.group({
            isConsentRelease: [false, Validators.requiredTrue],
            isPeriodicallyObtained: [false, Validators.requiredTrue],
            isInformationCorrect: [false, Validators.requiredTrue],
            licenseCheck: [false, Validators.requiredTrue],
            files: [null, Validators.required],
            firstRowReview: [null],
            issueDate: [null, Validators.required],
        });

        this.dontHaveMvrForm = this.formBuilder.group({
            dontHaveMvr: [false, Validators.required],
        });
    }

    public initMode(): void {
        this.applicantQuery.selectedMode$
            .pipe(takeUntil(this.destroy$))
            .subscribe((selectedMode: string) => {
                this.selectedMode = selectedMode;
            });
    }

    public getQueryParams(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            this.queryParamId = params.get('id');
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                if (res && res.id == this.queryParamId) {
                    this.isValidLoad = true;

                    this.applicantId = res.id;

                    const cdlInformation = res.cdlInformation;

                    this.licenses = cdlInformation?.licences.map((item) => {
                        return {
                            license: item.licenseNumber,
                            state: item.state?.stateName,
                            stateShort: item.state?.stateShortName,
                            classType: item.classType?.name,
                            expDate:
                                MethodsCalculationsHelper.convertDateFromBackend(
                                    item?.expDate
                                ),
                            restrictions: item.cdlRestrictions
                                .map((resItem) => resItem.code)
                                .join(eStringPlaceholder.COMMA_WHITESPACE),
                            endorsments: item.cdlEndorsements
                                .map((resItem) => resItem.code)
                                .join(eStringPlaceholder.COMMA_WHITESPACE),
                        };
                    });

                    if (res.mvrAuth) {
                        this.patchStepValues(res.mvrAuth);

                        this.stepHasValues = true;
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/load']);
                }
            });
    }

    public patchStepValues(stepValues: MvrAuthFeedbackResponse): void {
        const {
            isEmployee,
            isPeriodicallyObtained,
            isInformationCorrect,
            dontHaveMvr,
            onlyLicense,
            signature,
            files,
            id,
            issueDate,
            /*          filesReviewMessage, */
        } = stepValues;

        this.mvrAuthId = id;

        this.mvrAuthorizationForm.patchValue({
            isConsentRelease: isEmployee,
            isPeriodicallyObtained,
            isInformationCorrect,
            licenseCheck: onlyLicense,
            files: files ? JSON.stringify(files) : null,
            issueDate:
                MethodsCalculationsHelper.convertDateFromBackend(issueDate),
        });

        this.signatureImgSrc = signature;
        this.signature = signature;

        this.documents = files;

        this.dontHaveMvrForm.get('dontHaveMvr').patchValue(dontHaveMvr);

        if (dontHaveMvr)
            this.inputService.changeValidators(
                this.mvrAuthorizationForm.get(EFileFormControls.FILES),
                false
            );
        else
            this.inputService.changeValidators(
                this.mvrAuthorizationForm.get(EFileFormControls.FILES)
            );
    }

    public requestDrivingRecordFromEmployer(): void {
        this.dontHaveMvrForm
            .get('dontHaveMvr')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    const { files } = this.mvrAuthorizationForm.value;

                    this.previousStepValues = {
                        files,
                    };

                    this.inputService.changeValidators(
                        this.mvrAuthorizationForm.get(EFileFormControls.FILES),
                        false
                    );
                } else {
                    if (this.previousStepValues) {
                        const { files } = this.previousStepValues;

                        this.mvrAuthorizationForm.patchValue({
                            files,
                        });
                        EFileFormControls.FILES;
                    }

                    this.inputService.changeValidators(
                        this.mvrAuthorizationForm.get(EFileFormControls.FILES)
                    );
                }
            });
    }

    public onSignatureAction(event: any): void {
        if (event)
            this.signature = this.imageBase64Service.getStringFromBase64(event);
        else this.signature = null;
    }

    public onRemoveSignatureRequiredNoteAction(event: any): void {
        if (!event) return;
        this.displaySignatureRequiredNote = false;
    }

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case eGeneralActions.ADD:
                this.mvrAuthorizationForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            case eGeneralActions.DELETE:
                this.mvrAuthorizationForm
                    .get(EFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    event.deleteId,
                ];

                break;
            case 'mark-incorrect':
                if (this.selectedMode === SelectedMode.REVIEW)
                    this.incorrectInput(true, event.index, 0);

                break;
            case 'mark-correct':
                if (this.selectedMode === SelectedMode.REVIEW)
                    this.incorrectInput(false, event.index, 0);

                break;

            default:
                break;
        }
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

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

            if (!isAnyInputInLineIncorrect)
                this.mvrAuthorizationForm
                    .get('firstRowReview')
                    .patchValue(null);
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray.map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) this.hasIncorrectFields = true;
        else this.hasIncorrectFields = false;
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

    public onStepAction(event: any): void {
        if (event.action === StepAction.NEXT_STEP) {
            if (this.selectedMode === SelectedMode.REVIEW)
                this.onSubmitReview();
            else this.onSubmit();
        }

        if (event.action === StepAction.BACK_STEP)
            this.router.navigate([`/medical-certificate/${this.applicantId}`]);
    }

    public onSubmit(): void {
        if (this.mvrAuthorizationForm.invalid || !this.signature) {
            if (this.mvrAuthorizationForm.invalid) {
                this.inputService.markInvalid(this.mvrAuthorizationForm);

                if (!this.documents.length)
                    this.displayDocumentsRequiredNote = true;
            }

            if (!this.signature) this.displaySignatureRequiredNote = true;

            return;
        }

        const {
            isConsentRelease,
            isPeriodicallyObtained,
            isInformationCorrect,
            licenseCheck,
            issueDate,
        } = this.mvrAuthorizationForm.value;

        const { dontHaveMvr } = this.dontHaveMvrForm.value;

        let documents =
            this.documents
                .filter((item) => item.realFile)
                .map((item) => {
                    documents.push(item.realFile);
                }) ?? [];

        const saveData: any = {
            applicantId: this.applicantId,
            issueDate:
                MethodsCalculationsHelper.convertDateToBackend(issueDate),
            isEmployee: isConsentRelease,
            isPeriodicallyObtained,
            isInformationCorrect,
            dontHaveMvr,
            onlyLicense: licenseCheck,
            signature:
                this.selectedMode === SelectedMode.APPLICANT
                    ? this.signature
                    : this.signatureImgSrc,
            files: dontHaveMvr ? [] : documents,
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.mvrAuthId,
                filesForDeleteIds: this.documentsForDeleteIds,
            }),
        };

        const selectMatchingBackendMethod =
            (): Observable<CreateWithUploadsResponse> => {
                if (
                    this.selectedMode === SelectedMode.APPLICANT &&
                    !this.stepHasValues
                )
                    return this.applicantActionsService.createMvrAuthorization(
                        saveData
                    );

                if (
                    (this.selectedMode === SelectedMode.APPLICANT &&
                        this.stepHasValues) ||
                    this.selectedMode === SelectedMode.FEEDBACK
                )
                    return this.applicantActionsService.updateMvrAuthorization(
                        saveData
                    );
            };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/psp-authorization/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                mvrAuth: {
                                    ...store.applicant.mvrAuth,
                                    isEmployee: saveData.isEmployee,
                                    isPeriodicallyObtained:
                                        saveData.isPeriodicallyObtained,
                                    isInformationCorrect:
                                        saveData.isInformationCorrect,
                                    dontHaveMvr: saveData.dontHaveMvr,
                                    onlyLicense: saveData.onlyLicense,
                                    signature: saveData.signature,
                                    files: saveData.files,
                                    issueDate: saveData.issueDate,
                                },
                            },
                        };
                    });
                },
            });
    }

    public onSubmitReview(): void {
        const saveData: CreateMvrAuthReviewCommand = {
            applicantId: this.applicantId,
            filesReview: this.documents.map((item, index) => {
                return {
                    storageId: item.fileId,
                    isValid: !this.openAnnotationArray[0].lineInputs[index],
                };
            }),
        };

        const selectMatchingBackendMethod = (): Observable<
            CreateWithUploadsResponse | object
        > => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createMvrAuthorizationReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            )
                return this.applicantActionsService.updateMvrAuthorizationReview(
                    saveData
                );
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/psp-authorization/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                mvrAuth: {
                                    ...store.applicant.mvrAuth,
                                    files: store.applicant.mvrAuth.files.map(
                                        (item, index) => {
                                            return {
                                                ...item,
                                                review: saveData.filesReview[
                                                    index
                                                ],
                                            };
                                        }
                                    ),
                                },
                            },
                        };
                    });
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
