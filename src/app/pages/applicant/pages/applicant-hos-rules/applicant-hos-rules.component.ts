import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantStore } from '@pages/applicant/state/applicant.store';
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';

// models
import {
    ApplicantResponse,
    CreateHosRulesReviewCommand,
    HosRuleFeedbackResponse,
    UpdatePspAuthCommand,
} from 'appcoretruckassist';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

@Component({
    selector: 'app-hos-rules',
    templateUrl: './applicant-hos-rules.component.html',
    styleUrls: ['./applicant-hos-rules.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        ApplicantNextBackBtnComponent
    ],
})
export class ApplicantHosRulesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public isValidLoad: boolean;

    public hosRulesForm: UntypedFormGroup;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.initMode();

        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.hosRulesForm = this.formBuilder.group({
            isReadingConfirmed: [false, Validators.requiredTrue],
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

                    if (res.hosRule) {
                        this.patchStepValues(res.hosRule);
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/website']);
                }
            });
    }

    public patchStepValues(stepValues: HosRuleFeedbackResponse): void {
        const { isConfirm } = stepValues;

        this.hosRulesForm.patchValue({
            isReadingConfirmed: isConfirm,
        });
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
            this.router.navigate([`/sph/${this.applicantId}`]);
        }
    }

    public onSubmit(): void {
        if (this.hosRulesForm.invalid) {
            this.inputService.markInvalid(this.hosRulesForm);
            return;
        }

        const { isReadingConfirmed } = this.hosRulesForm.value;

        const saveData: UpdatePspAuthCommand = {
            applicantId: this.applicantId,
            isConfirm: isReadingConfirmed,
        };

        this.applicantActionsService
            .updateHosRules(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/applicant/end`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                hosRule: {
                                    ...store.applicant.hosRule,
                                    isConfirm: saveData.isConfirm,
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
        const saveData: CreateHosRulesReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createHosRulesReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/applicant/end`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                hosRule: {
                                    ...store.applicant.hosRule,
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
