import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
<<<<<<< HEAD
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';
=======
>>>>>>> develop

import { anyInputInLineIncorrect } from '../../state/utils/utils';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
<<<<<<< HEAD
import { ApplicantResponse, CdlCardFeedbackResponse } from 'appcoretruckassist';
=======
>>>>>>> develop

@Component({
    selector: 'app-cdl-card',
    templateUrl: './cdl-card.component.html',
    styleUrls: ['./cdl-card.component.scss'],
})
export class CdlCardComponent implements OnInit {
    public selectedMode: string = SelectedMode.APPLICANT;

    public cdlCardForm: FormGroup;

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
        private inputService: TaInputService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        this.cdlCardForm = this.formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],

            firstRowReview: [null],
            secondRowReview: [null],
        });
    }

<<<<<<< HEAD
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

=======
>>>>>>> develop
    public onFilesAction(event: any): void {
        this.documents = event.files;
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
            if (this.selectedMode === SelectedMode.APPLICANT) {
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
<<<<<<< HEAD

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
=======
>>>>>>> develop
    }

    public onSubmitReview(): void {}
}
