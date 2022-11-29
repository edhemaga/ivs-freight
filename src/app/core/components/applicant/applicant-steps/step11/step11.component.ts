import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    AuthorizationFeedbackResponse,
    CreateAuthorizationReviewCommand,
    UpdateAuthorizationCommand,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
    selector: 'app-step11',
    templateUrl: './step11.component.html',
    styleUrls: ['./step11.component.scss'],
})
export class Step11Component implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public authorizationForm: FormGroup;

    public applicantId: number;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantActionsService,
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

    public handleCheckboxParagraphClick(type: string): void {
        if (
            this.selectedMode === SelectedMode.FEEDBACK ||
            this.selectedMode === SelectedMode.REVIEW
        ) {
            return;
        }

        switch (type) {
            case InputSwitchActions.FIRST_AUTHORIZATION:
                this.authorizationForm.patchValue({
                    isFirstAuthorization: !this.authorizationForm.get(
                        'isFirstAuthorization'
                    ).value,
                });

                break;
            case InputSwitchActions.SECOND_AUTHORIZATION:
                this.authorizationForm.patchValue({
                    isSecondAuthorization: !this.authorizationForm.get(
                        'isSecondAuthorization'
                    ).value,
                });

                break;
            case InputSwitchActions.THIRD_AUTHORIZATION:
                this.authorizationForm.patchValue({
                    isThirdAuthorization: !this.authorizationForm.get(
                        'isThirdAuthorization'
                    ).value,
                });

                break;
            case InputSwitchActions.FOURTH_AUTHORIZATION:
                this.authorizationForm.patchValue({
                    isFourthAuthorization: !this.authorizationForm.get(
                        'isFourthAuthorization'
                    ).value,
                });

                break;

            default:
                break;
        }
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
