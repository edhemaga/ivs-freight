import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';
import { ApplicantStore } from '@pages/applicant/state/applicant.store';

// enums
import { InputSwitchActions } from '@pages/applicant/enums/input-switch-actions.enum';
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import {
    ApplicantResponse,
    CreateDisclosureReviewCommand,
    DisclosureReleaseFeedbackResponse,
    UpdateDisclosureReleaseCommand,
} from 'appcoretruckassist/model/models';
import { StringConstantsStep10 } from '@pages/applicant/pages/applicant-application/models/string-constants.model';

// modules
import { CommonModule } from '@angular/common';
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

// constants
import { ApplicantApplicationConstants } from '@pages/applicant/pages/applicant-application/utils/constants/applicant-application.constants';

@Component({
    selector: 'app-step10',
    templateUrl: './step10.component.html',
    styleUrls: ['./step10.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
    ],
})
export class Step10Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public disclosureReleaseForm: UntypedFormGroup;

    public applicantId: number;

    public companyName: string;

    public stringConstants: StringConstantsStep10;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getStepValuesFromStore();

        this.initStringConstants();
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

    public initStringConstants() {
        this.stringConstants = ApplicantApplicationConstants.stringConstantsStep10(
            this.companyName
        );
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
