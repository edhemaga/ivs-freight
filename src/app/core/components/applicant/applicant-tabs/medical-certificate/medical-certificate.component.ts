import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import {
    ApplicantResponse,
    CreateMedicalCertificateReviewCommand,
    MedicalCertificateFeedbackResponse,
} from 'appcoretruckassist';

@Component({
    selector: 'app-medical-certificate',
    templateUrl: './medical-certificate.component.html',
    styleUrls: ['./medical-certificate.component.scss'],
})
export class MedicalCertificateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.REVIEW;

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
        private applicantActionsService: ApplicantActionsService
    ) {}

    ngOnInit(): void {
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
            fromDate: convertDateFromBackend(issueDate),
            toDate: convertDateFromBackend(expireDate),
            files: JSON.stringify(files),
        });

        this.documents = files;

        if (this.selectedMode === SelectedMode.REVIEW) {
            if (stepValues.files[0].review) {
                this.stepHasReviewValues = true;

                const {
                    isIssueDateValid,
                    isExpireDateValid,
                    dateMessage,
                    filesReviewMessage,
                } = stepValues.medicalCertificateReview;

                this.openAnnotationArray[0] = {
                    ...this.openAnnotationArray[0],
                    lineInputs: [!isIssueDateValid, !isExpireDateValid],
                    displayAnnotationButton:
                        (!isIssueDateValid || !isExpireDateValid) &&
                        !dateMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: dateMessage ? true : false,
                };

                for (let i = 0; i < stepValues.files.length; i++) {
                    const isFileValid = stepValues.files[i].review.isValid;

                    this.openAnnotationArray[1].lineInputs = [
                        ...this.openAnnotationArray[1].lineInputs,
                        !isFileValid,
                    ];
                }

                const filesLineInputItems =
                    this.openAnnotationArray[1].lineInputs;
                const isAnyInputInLineIncorrect =
                    anyInputInLineIncorrect(filesLineInputItems);

                if (isAnyInputInLineIncorrect && !filesReviewMessage) {
                    this.openAnnotationArray[1].displayAnnotationButton = true;
                }

                if (isAnyInputInLineIncorrect && filesReviewMessage) {
                    this.openAnnotationArray[1].displayAnnotationTextArea =
                        true;
                }

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray.map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFields = true;
                } else {
                    this.hasIncorrectFields = false;
                }

                this.medicalCertificateForm.patchValue({
                    firstRowReview: dateMessage,
                    secondRowReview: filesReviewMessage,
                });
            }
        }
    }

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case 'add':
                this.medicalCertificateForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.medicalCertificateForm
                    .get('files')
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
        if (event.action === 'next-step') {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }
    }

    public onSubmit(): void {
        if (this.medicalCertificateForm.invalid) {
            if (this.medicalCertificateForm.invalid) {
                this.inputService.markInvalid(this.medicalCertificateForm);
            }

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
            issueDate: convertDateToBackend(fromDate),
            expireDate: convertDateToBackend(toDate),
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
            filesReviewMessage:
                this.medicalCertificateForm.get('secondRowReview').value,
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
