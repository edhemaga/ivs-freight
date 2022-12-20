import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
import { UploadFile } from '../../../shared/ta-upload-files/ta-upload-file/ta-upload-file.component';

@Component({
    selector: 'app-medical-certificate',
    templateUrl: './medical-certificate.component.html',
    styleUrls: ['./medical-certificate.component.scss'],
})
export class MedicalCertificateComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.REVIEW;

    public medicalCertificateForm: FormGroup;

    public applicantId: number;
    public medicalCertificateId: number | null = null;

    public stepHasValues: boolean = false;

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
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public hasIncorrectFields: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantActionsService
    ) {}

    ngOnInit(): void {
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

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.medicalCertificate) {
                    this.patchStepValues(res.medicalCertificate);

                    this.stepHasValues = true;
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
    }

    public onFilesAction(event: any): void {
        console.log('event', event);
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

            default:
                break;
        }
    }

    public onFilesReviewAction(event: {
        file: UploadFile;
        message: string;
    }): void {
        console.log('reviewEvent', event);
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
            this.openAnnotationArray
                .filter((item) => Object.keys(item).length !== 0)
                .map((item) => item.lineInputs)
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
            if (
                this.selectedMode === SelectedMode.APPLICANT ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
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

        const documents = this.documents.map((item) => item.realFile);

        const saveData: any = {
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
            filesReview: [],
        };

        console.log('saveData', saveData);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
