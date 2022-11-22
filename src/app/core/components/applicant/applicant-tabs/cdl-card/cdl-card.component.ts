import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ApplicantResponse, CdlCardFeedbackResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-cdl-card',
    templateUrl: './cdl-card.component.html',
    styleUrls: ['./cdl-card.component.scss'],
})
export class CdlCardComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public cdlCardForm: FormGroup;

    public applicantId: number;

    public stepHasValues: boolean = false;

    public documents: any[] = [];

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
        this.cdlCardForm = this.formBuilder.group({
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

                if (res.cdlCard) {
                    this.patchStepValues(res.cdlCard);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: CdlCardFeedbackResponse): void {
        console.log('stepValues', stepValues);
        const { issueDate, expireDate } = stepValues;

        this.cdlCardForm.patchValue({
            fromDate: convertDateFromBackend(issueDate),
            toDate: convertDateFromBackend(expireDate),
        });
    }

    public onFilesAction(event: any): void {
        this.documents = event.files;

        switch (event.action) {
            case 'add':
                this.cdlCardForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.cdlCardForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

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
                        this.cdlCardForm.get('firstRowReview').patchValue(null);
                    }

                    break;
                case 1:
                    if (!isAnyInputInLineIncorrect) {
                        this.cdlCardForm
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
        if (this.cdlCardForm.invalid) {
            this.inputService.markInvalid(this.cdlCardForm);
            return;
        }

        const { fromDate, toDate } = this.cdlCardForm.value;

        const documents = this.documents.map((item) => {
            return item.realFile;
        });

        const saveData: any = {
            applicantId: this.applicantId,
            issueDate: convertDateToBackend(fromDate),
            expireDate: convertDateToBackend(toDate),
            files: documents,
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createCdlCard(saveData);
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateCdlCard(saveData);
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/applicant/end`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.cdlCard,
                                cdlCard: {
                                    ...store.applicant.medicalCertificate,
                                    issueDate: saveData.issueDate,
                                    expireDate: saveData.expireDate,
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

    public onSubmitReview(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
