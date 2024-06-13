import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';
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
    AuthorizationFeedbackResponse,
    CreateAuthorizationReviewCommand,
    PersonalInfoFeedbackResponse,
    UpdateAuthorizationCommand,
} from 'appcoretruckassist';
import { StringConstantsStep11 } from '@pages/applicant/pages/applicant-application/models/string-constants.model';

// modules
import { CommonModule } from '@angular/common';
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { ApplicantCardComponent } from '@pages/applicant/components/applicant-card/applicant-card.component';

// helpers
import { ApplicantApplicationConstants } from '@pages/applicant/pages/applicant-application/utils/constants/applicant-application.constants';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Component({
    selector: 'app-step11',
    templateUrl: './step11.component.html',
    styleUrls: ['./step11.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        ApplicantCardComponent,
    ],
})
export class Step11Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public authorizationForm: UntypedFormGroup;

    public applicantId: number;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public stringConstants: StringConstantsStep11 =
        ApplicantApplicationConstants.stringConstantsStep11;
    public applicantCardInfo: PersonalInfoFeedbackResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService,
        private imageBase64Service: ImageBase64Service
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.authorizationForm = this.formBuilder.group({
            isFirstAuthorization: [false, Validators.requiredTrue],
            isSecondAuthorization: [false, Validators.requiredTrue],
            isThirdAuthorization: [false, Validators.requiredTrue],
            isFourthAuthorization: [false, Validators.requiredTrue],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                this.applicantId = res.id;

                if (res.authorization) {
                    this.patchStepValues(res.authorization);
                }

                const personalInfo = res.personalInfo;

                this.applicantCardInfo = {
                    fullName: personalInfo?.fullName,
                    ssn: personalInfo?.ssn,
                    doB: MethodsCalculationsHelper.convertDateFromBackend(
                        personalInfo?.doB
                    ),
                };
            });
    }

    public patchStepValues(stepValues: AuthorizationFeedbackResponse): void {
        const {
            isFirstAuthorization,
            isSecondAuthorization,
            isThirdAuthorization,
            isFourthAuthorization,
            signature,
        } = stepValues;

        this.authorizationForm.patchValue({
            isFirstAuthorization,
            isSecondAuthorization,
            isThirdAuthorization,
            isFourthAuthorization,
        });

        this.signatureImgSrc = signature;
        this.signature = signature;
    }
    
    public onSignatureAction(event: any): void {
        if (event) {
            this.signature = this.imageBase64Service.getStringFromBase64(event);
        } else {
            this.signature = null;
        }
    }

    public onRemoveSignatureRequiredNoteAction(event: any): void {
        if (event) {
            this.displaySignatureRequiredNote = false;
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
            this.router.navigate([`/application/${this.applicantId}/10`]);
        }
    }

    public onSubmit(): void {
        if (this.authorizationForm.invalid || !this.signature) {
            if (this.authorizationForm.invalid) {
                this.inputService.markInvalid(this.authorizationForm);
            }

            if (!this.signature) {
                this.displaySignatureRequiredNote = true;
            }

            return;
        }

        const authorizationForm = this.authorizationForm.value;

        const saveData: UpdateAuthorizationCommand = {
            ...authorizationForm,
            applicantId: this.applicantId,
            signature:
                this.selectedMode === SelectedMode.APPLICANT
                    ? this.signature
                    : this.signatureImgSrc,
        };

        this.applicantActionsService
            .updateAuthorization(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/medical-certificate/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                authorization: {
                                    ...store.applicant.authorization,
                                    isFirstAuthorization:
                                        saveData.isFirstAuthorization,
                                    isSecondAuthorization:
                                        saveData.isSecondAuthorization,
                                    isThirdAuthorization:
                                        saveData.isThirdAuthorization,
                                    isFourthAuthorization:
                                        saveData.isFourthAuthorization,
                                    signature: saveData.signature,
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
        const saveData: CreateAuthorizationReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createAuthorizationReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/medical-certificate/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                authorization: {
                                    ...store.applicant.authorization,
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
