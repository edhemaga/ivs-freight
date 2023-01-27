import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    CreateDisclosureReviewCommand,
    DisclosureReleaseFeedbackResponse,
    UpdateDisclosureReleaseCommand,
} from 'appcoretruckassist/model/models';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
    selector: 'app-step10',
    templateUrl: './step10.component.html',
    styleUrls: ['./step10.component.scss'],
})
export class Step10Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public disclosureReleaseForm: FormGroup;

    public applicantId: number;

    public companyName: string;

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

    public createForm(): void {
        this.disclosureReleaseForm = this.formBuilder.group({
            isFirstDisclosure: [false, Validators.requiredTrue],
            isSecondDisclosure: [false, Validators.requiredTrue],
            isThirdDisclosure: [false, Validators.requiredTrue],
            isFourthDisclosure: [false, Validators.requiredTrue],
            isFifthDisclosure: [false, Validators.requiredTrue],
            isSixthDisclosure: [false, Validators.requiredTrue],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                this.companyName = res.companyInfo.name;

                if (res.disclosureRelease) {
                    this.patchStepValues(res.disclosureRelease);
                }
            });
    }

    public patchStepValues(stepValues: DisclosureReleaseFeedbackResponse) {
        const {
            isFirstDisclosure,
            isSecondDisclosure,
            isThirdDisclosure,
            isFourthDisclosure,
            isFifthDisclosure,
            isSixDisclosure,
        } = stepValues;

        this.disclosureReleaseForm.patchValue({
            isFirstDisclosure,
            isSecondDisclosure,
            isThirdDisclosure,
            isFourthDisclosure,
            isFifthDisclosure,
            isSixthDisclosure: isSixDisclosure,
        });
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (
            this.selectedMode === SelectedMode.FEEDBACK ||
            this.selectedMode === SelectedMode.REVIEW
        ) {
            return;
        }

        switch (type) {
            case InputSwitchActions.FIRST_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isFirstDisclosure:
                        !this.disclosureReleaseForm.get('isFirstDisclosure')
                            .value,
                });

                break;
            case InputSwitchActions.SECOND_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isSecondDisclosure:
                        !this.disclosureReleaseForm.get('isSecondDisclosure')
                            .value,
                });

                break;
            case InputSwitchActions.THIRD_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isThirdDisclosure:
                        !this.disclosureReleaseForm.get('isThirdDisclosure')
                            .value,
                });

                break;
            case InputSwitchActions.FOURTH_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isFourthDisclosure:
                        !this.disclosureReleaseForm.get('isFourthDisclosure')
                            .value,
                });

                break;
            case InputSwitchActions.FIFTH_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isFifthDisclosure:
                        !this.disclosureReleaseForm.get('isFifthDisclosure')
                            .value,
                });

                break;
            case InputSwitchActions.SIXTH_DISCLOSURE:
                this.disclosureReleaseForm.patchValue({
                    isSixthDisclosure:
                        !this.disclosureReleaseForm.get('isSixthDisclosure')
                            .value,
                });

                break;
            default:
                break;
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

        if (event.action === 'back-step') {
            this.router.navigate([`/application/${this.applicantId}/9`]);
        }
    }

    public onSubmit(): void {
        if (this.disclosureReleaseForm.invalid) {
            this.inputService.markInvalid(this.disclosureReleaseForm);
            return;
        }

        const { isSixthDisclosure, ...disclosureReleaseForm } =
            this.disclosureReleaseForm.value;

        const saveData: UpdateDisclosureReleaseCommand = {
            ...disclosureReleaseForm,
            applicantId: this.applicantId,
            isSixDisclosure: isSixthDisclosure,
        };

        this.applicantActionsService
            .updateDisclosureAndRelease(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/11`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                disclosureRelease: {
                                    ...store.applicant.disclosureRelease,
                                    isFirstDisclosure:
                                        saveData.isFirstDisclosure,
                                    isSecondDisclosure:
                                        saveData.isSecondDisclosure,
                                    isThirdDisclosure:
                                        saveData.isThirdDisclosure,
                                    isFourthDisclosure:
                                        saveData.isFourthDisclosure,
                                    isFifthDisclosure:
                                        saveData.isFifthDisclosure,
                                    isSixDisclosure: saveData.isSixDisclosure,
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
        const saveData: CreateDisclosureReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createDisclosureAndReleaseReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/11`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                disclosureRelease: {
                                    ...store.applicant.disclosureRelease,
                                    reviewed: true,
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
