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
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import {
    ApplicantResponse,
    DriverRightsFeedbackResponse,
    UpdateDriverRightsCommand,
    CreateDriverRightsReviewCommand,
} from 'appcoretruckassist/model/models';
import { StringConstantsStep9 } from '@pages/applicant/pages/applicant-application/models/string-constants.model';

// modules
import { CommonModule } from '@angular/common';
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';

// helpers
import { ApplicantApplicationConstants } from '@pages/applicant/pages/applicant-application/utils/constants/applicant-application.constants';

@Component({
    selector: 'app-step9',
    templateUrl: './step9.component.html',
    styleUrls: ['./step9.component.scss'],
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
export class Step9Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public applicantId: number;

    public driverRightsForm: UntypedFormGroup;

    public stringConstants: StringConstantsStep9 =
        ApplicantApplicationConstants.stringConstantsStep9;

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
    }

    public createForm(): void {
        this.driverRightsForm = this.formBuilder.group({
            understandYourRights: [false, Validators.requiredTrue],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.driverRight) {
                    this.patchStepValues(res.driverRight);
                }
            });
    }

    public patchStepValues(stepValues: DriverRightsFeedbackResponse): void {
        const { understandDriverRights } = stepValues;

        this.driverRightsForm
            .get('understandYourRights')
            .patchValue(understandDriverRights);
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
            this.router.navigate([`/application/${this.applicantId}/8`]);
        }
    }

    public onSubmit(): void {
        if (this.driverRightsForm.invalid) {
            this.inputService.markInvalid(this.driverRightsForm);
            return;
        }

        const { understandYourRights } = this.driverRightsForm.value;

        const saveData: UpdateDriverRightsCommand = {
            understandDriverRights: understandYourRights,
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .updateDriverRights(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/10`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                driverRight: {
                                    ...store.applicant.driverRight,
                                    understandDriverRights:
                                        saveData.understandDriverRights,
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
        const saveData: CreateDriverRightsReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createDriverRightsReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/10`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                driverRight: {
                                    ...store.applicant.driverRight,
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
