import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
<<<<<<< HEAD
import {
    ApplicantResponse,
    HosRuleFeedbackResponse,
    UpdatePspAuthCommand,
} from 'appcoretruckassist';
=======
>>>>>>> develop

@Component({
    selector: 'app-hos-rules',
    templateUrl: './hos-rules.component.html',
    styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit {
    public selectedMode: string = SelectedMode.APPLICANT;

    public hosRulesForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    public createForm(): void {
        this.hosRulesForm = this.formBuilder.group({
            isReadingConfirmed: [false, Validators.requiredTrue],
        });
    }

<<<<<<< HEAD
    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.hosRule) {
                    this.patchStepValues(res.hosRule);
                }
            });
    }

    public patchStepValues(stepValues: HosRuleFeedbackResponse): void {
        const { isConfirm } = stepValues;

        this.hosRulesForm.patchValue({
            isReadingConfirmed: isConfirm,
        });
    }

=======
>>>>>>> develop
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
        if (this.hosRulesForm.invalid) {
            this.inputService.markInvalid(this.hosRulesForm);
            return;
        }
<<<<<<< HEAD

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
=======
>>>>>>> develop
    }

    public onSubmitReview(): void {}
}
