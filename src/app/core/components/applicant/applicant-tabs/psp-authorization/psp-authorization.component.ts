import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from './../../../../utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantResponse } from 'appcoretruckassist';

@Component({
    selector: 'app-psp-authorization',
    templateUrl: './psp-authorization.component.html',
    styleUrls: ['./psp-authorization.component.scss'],
})
export class PspAuthorizationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public pspAuthorizationForm: FormGroup;

    public signature: any;

    public applicantCardInfo: any;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.pspAuthorizationForm = this.formBuilder.group({
            isConfirm: [false, Validators.requiredTrue],
            isAuthorize: [false, Validators.requiredTrue],
            isFurtherUnderstand: [false, Validators.requiredTrue],
            isPspReport: [false, Validators.requiredTrue],
            isDisclosureRegardingReport: [false, Validators.requiredTrue],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                const personalInfo = res.personalInfo;

                this.applicantCardInfo = {
                    name: personalInfo?.fullName,
                    ssn: personalInfo?.ssn,
                    dob: convertDateFromBackend(personalInfo?.doB),
                };
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
            case InputSwitchActions.IS_AUTHORIZE:
                this.pspAuthorizationForm.patchValue({
                    isAuthorize:
                        !this.pspAuthorizationForm.get('isAuthorize').value,
                });

                break;
            case InputSwitchActions.IS_FURTHER_UNDERSTAND:
                this.pspAuthorizationForm.patchValue({
                    isFurtherUnderstand: !this.pspAuthorizationForm.get(
                        'isFurtherUnderstand'
                    ).value,
                });

                break;
            case InputSwitchActions.IS_PSP_REPORT:
                this.pspAuthorizationForm.patchValue({
                    isPspReport:
                        !this.pspAuthorizationForm.get('isPspReport').value,
                });

                break;
            case InputSwitchActions.IS_DISCLOSURE_REGARDING_REPORT:
                this.pspAuthorizationForm.patchValue({
                    isDisclosureRegardingReport: !this.pspAuthorizationForm.get(
                        'isDisclosureRegardingReport'
                    ).value,
                });

                break;
            default:
                break;
        }
    }

    public onSignatureAction(event: any): void {
        this.signature = event;
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
        if (this.pspAuthorizationForm.invalid) {
            this.inputService.markInvalid(this.pspAuthorizationForm);
            return;
        }
    }

    public onSubmitReview(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
