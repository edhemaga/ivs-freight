import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from './../../../../utils/methods.calculations';

import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    CreatePspAuthReviewCommand,
    PspAuthFeedbackResponse,
    UpdatePspAuthCommand,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
    selector: 'app-psp-authorization',
    templateUrl: './psp-authorization.component.html',
    styleUrls: ['./psp-authorization.component.scss'],
})
export class PspAuthorizationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.REVIEW;

    public isValidLoad: boolean;

    public pspAuthorizationForm: UntypedFormGroup;

    public companyName: string;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public applicantCardInfo: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantActionsService,
        private imageBase64Service: ImageBase64Service,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
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
                        name: personalInfo?.fullName,
                        ssn: personalInfo?.ssn,
                        dob: convertDateFromBackend(personalInfo?.doB),
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
