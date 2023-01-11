import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import {
    ApplicantResponse,
    CreateHosRulesReviewCommand,
    HosRuleFeedbackResponse,
    UpdatePspAuthCommand,
} from 'appcoretruckassist';

@Component({
    selector: 'app-hos-rules',
    templateUrl: './hos-rules.component.html',
    styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public isValidLoad: boolean;

    public hosRulesForm: FormGroup;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantActionsService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.hosRulesForm = this.formBuilder.group({
            isReadingConfirmed: [false, Validators.requiredTrue],
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
                    this.applicantId = res.id;

                    if (res.hosRule) {
                        this.patchStepValues(res.hosRule);
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);
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
                    this.router.navigate([`/ssn-card/${this.applicantId}`]);

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
                    this.router.navigate([`/ssn-card/${this.applicantId}`]);

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
