import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { anyInputInLineIncorrect } from '@pages/applicant/utils/helpers/applicant.helper';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';
import { ApplicantStore } from '@pages/applicant/state/applicant.store';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';
import { eFileFormControls, eGeneralActions } from '@shared/enums';

// models
import {
    ApplicantResponse,
    CreateMedicalCertificateReviewCommand,
    MedicalCertificateFeedbackResponse,
} from 'appcoretruckassist';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCounterComponent } from '@shared/components/ta-counter/ta-counter.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-medical-certificate',
    templateUrl: './applicant-medical-certificate.component.html',
    styleUrls: ['./applicant-medical-certificate.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaInputComponent,
        TaUploadFilesComponent,
        TaCounterComponent,
        ApplicantNextBackBtnComponent,
    ],
})
export class ApplicantMedicalCertificateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public isValidLoad: boolean;

    public medicalCertificateForm: UntypedFormGroup;

    public applicantId: number;
    public medicalCertificateId: number | null = null;
    public queryParamId: number | string | null = null;

    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {
            lineIndex: 0,
            lineInputs: [false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
        {
            lineIndex: 1,
            lineInputs: [],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public hasIncorrectFields: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService
    ) {}

    ngOnInit(): void {
        this.initMode();

        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();
    }

    private createForm(): void {
        this.medicalCertificateForm = this.formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            files: [null, Validators.required],

            firstRowReview: [null],
            secondRowReview: [null],
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

                    if (res.medicalCertificate) {
                        this.patchStepValues(res.medicalCertificate);

                        this.stepHasValues = true;
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/website']);
                }
            });
    }

    public patchStepValues(
        stepValues: MedicalCertificateFeedbackResponse
    ): void {
        const { issueDate, expireDate, files, id } = stepValues;

        this.medicalCertificateId = id;

        this.medicalCertificateForm.patchValue({
            fromDate:
                MethodsCalculationsHelper.convertDateFromBackend(issueDate),
            toDate: MethodsCalculationsHelper.convertDateFromBackend(
                expireDate
            ),
            files: JSON.stringify(files),
        });

        this.documents = files;
    }

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case eGeneralActions.ADD:
                this.medicalCertificateForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case eGeneralActions.DELETE_LOWERCASE:
                this.medicalCertificateForm
                    .get(eFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    event.deleteId,
                ];

                break;
            case 'mark-incorrect':
                if (this.selectedMode === SelectedMode.REVIEW) {
                    this.incorrectInput(true, event.index, 1);
                }

                break;
            case 'mark-correct':
                if (this.selectedMode === SelectedMode.REVIEW) {
                    this.incorrectInput(false, event.index, 1);
                }

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

            switch (lineIndex) {
                case 0:
                    if (!isAnyInputInLineIncorrect) {
                        this.medicalCertificateForm
                            .get('firstRowReview')
                            .patchValue(null);
                    }

                    break;
                case 1:
                    if (!isAnyInputInLineIncorrect) {
                        this.medicalCertificateForm
                            .get('secondRowReview')
                            .patchValue(null);
                    }

                    break;

                default:
                    break;
            }
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray.map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.hasIncorrectFields = true;
        } else {
            this.hasIncorrectFields = false;
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

    public onStepAction(event: any): void {
        if (event.action === StepAction.NEXT_STEP) {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === StepAction.BACK_STEP) {
            this.router.navigate([`/owner-info/${this.applicantId}`]);
        }
    }

    public onSubmit(): void {
        if (this.medicalCertificateForm.invalid) {
            this.inputService.markInvalid(this.medicalCertificateForm);

            if (!this.documents.length) {
                this.displayDocumentsRequiredNote = true;
            }

            return;
        }

        const { fromDate, toDate } = this.medicalCertificateForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const saveData = {
            applicantId: this.applicantId,
            issueDate: MethodsCalculationsHelper.convertDateToBackend(fromDate),
            expireDate: MethodsCalculationsHelper.convertDateToBackend(toDate),
            files: documents,
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.medicalCertificateId,
                filesForDeleteIds: this.documentsForDeleteIds,
            }),
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createMedicalCertificate(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateMedicalCertificate(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/mvr-authorization/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                medicalCertificate: {
                                    ...store.applicant.medicalCertificate,
                                    issueDate: saveData.issueDate,
                                    expireDate: saveData.expireDate,
                                    files: saveData.files,
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
        const saveData: CreateMedicalCertificateReviewCommand = {
            applicantId: this.applicantId,
            isIssueDateValid: !this.openAnnotationArray[0].lineInputs[0],
            isExpireDateValid: !this.openAnnotationArray[0].lineInputs[1],
            dateMessage:
                this.medicalCertificateForm.get('firstRowReview').value,
            filesReview: this.documents.map((item, index) => {
                return {
                    storageId: item.fileId,
                    isValid: !this.openAnnotationArray[1].lineInputs[index],
                };
            }),
            /*   filesReviewMessage:
                this.medicalCertificateForm.get('secondRowReview').value, */
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createMedicalCertificateReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateMedicalCertificateReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/mvr-authorization/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                medicalCertificate: {
                                    ...store.applicant.medicalCertificate,
                                    files: store.applicant.medicalCertificate.files.map(
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
