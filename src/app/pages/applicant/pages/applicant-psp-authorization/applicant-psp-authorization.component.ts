import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subject, takeUntil } from 'rxjs';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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
import { PspAuthorizationFormFields } from '@pages/applicant/pages/applicant-psp-authorization/enums/psp-authorization-form-fields.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';

// models
import {
    ApplicantResponse,
    CreatePspAuthReviewCommand,
    PersonalInfoFeedbackResponse,
    PspAuthFeedbackResponse,
    UpdatePspAuthCommand,
} from 'appcoretruckassist';

// modules
import { SharedModule } from '@shared/shared.module';
import { ApplicantModule } from '@pages/applicant/applicant.module';

// components
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { ApplicantCardComponent } from '@pages/applicant/components/applicant-card/applicant-card.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

@Component({
    selector: 'app-psp-authorization',
    templateUrl: './applicant-psp-authorization.component.html',
    styleUrls: ['./applicant-psp-authorization.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        ApplicantCardComponent,
        ApplicantNextBackBtnComponent
    ],
})
export class ApplicantPspAuthorizationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public isValidLoad: boolean;

    public pspAuthorizationForm: UntypedFormGroup;

    public companyName: string;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public applicantCardInfo: PersonalInfoFeedbackResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService,
        private imageBase64Service: ImageBase64Service,
        private route: ActivatedRoute
    ) {}

    get isAuthorizeFormControl() {
        return this.pspAuthorizationForm.get(
            PspAuthorizationFormFields.IS_AUTHORIZE
        );
    }

    get isFurtherUnderstandFormControl() {
        return this.pspAuthorizationForm.get(
            PspAuthorizationFormFields.IS_FURTHER_UNDERSTAND
        );
    }

    get isPspReportFormControl() {
        return this.pspAuthorizationForm.get(
            PspAuthorizationFormFields.IS_PSP_REPORT
        );
    }

    get isDisclosureRegardingReportFormControl() {
        return this.pspAuthorizationForm.get(
            PspAuthorizationFormFields.IS_DISCLOSURE_REGARDING_REPORT
        );
    }

    ngOnInit(): void {
        this.initMode();

        this.getQueryParams();

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

                    const personalInfo = res.personalInfo;

                    this.applicantCardInfo = {
                        fullName: personalInfo?.fullName,
                        ssn: personalInfo?.ssn,
                        doB: MethodsCalculationsHelper.convertDateFromBackend(
                            personalInfo?.doB
                        ),
                    };

                    this.applicantId = res.id;

                    this.companyName = res.companyInfo.name;

                    if (res.pspAuth) {
                        this.patchStepValues(res.pspAuth);
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/website']);
                }
            });
    }

    public patchStepValues(stepValues: PspAuthFeedbackResponse): void {
        const {
            isConfirm,
            isAuthorize,
            isFurtherUnderstand,
            isPspReport,
            isDisclosureRegardingReport,
            signature,
        } = stepValues;

        this.pspAuthorizationForm.patchValue({
            isConfirm,
            isAuthorize,
            isFurtherUnderstand,
            isPspReport,
            isDisclosureRegardingReport,
        });

        this.signatureImgSrc = signature;
        this.signature = signature;
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (this.selectedMode !== SelectedMode.APPLICANT) {
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
        if (event.action === StepAction.NEXT_STEP) {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === StepAction.BACK_STEP) {
            this.router.navigate([`/mvr-authorization/${this.applicantId}`]);
        }
    }

    public onSubmit(): void {
        if (this.pspAuthorizationForm.invalid || !this.signature) {
            if (this.pspAuthorizationForm.invalid) {
                this.inputService.markInvalid(this.pspAuthorizationForm);
            }

            if (!this.signature) {
                this.displaySignatureRequiredNote = true;
            }

            return;
        }

        const {
            isConfirm,
            isAuthorize,
            isFurtherUnderstand,
            isPspReport,
            isDisclosureRegardingReport,
        } = this.pspAuthorizationForm.value;

        const saveData: UpdatePspAuthCommand = {
            applicantId: this.applicantId,
            isConfirm,
            isAuthorize,
            isFurtherUnderstand,
            isPspReport,
            isDisclosureRegardingReport,
            signature:
                this.selectedMode === SelectedMode.APPLICANT
                    ? this.signature
                    : this.signatureImgSrc,
        };

        this.applicantActionsService
            .updatePspAuthorization(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/sph/${this.applicantId}`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                pspAuth: {
                                    ...store.applicant.pspAuth,
                                    isConfirm: saveData.isConfirm,
                                    isAuthorize: saveData.isAuthorize,
                                    isFurtherUnderstand:
                                        saveData.isFurtherUnderstand,
                                    isPspReport: saveData.isPspReport,
                                    isDisclosureRegardingReport:
                                        saveData.isDisclosureRegardingReport,
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
        const saveData: CreatePspAuthReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createPspAuthorizationReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/sph/${this.applicantId}`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                pspAuth: {
                                    ...store.applicant.pspAuth,
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
