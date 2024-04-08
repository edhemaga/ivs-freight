import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

// helpers
import { MethodsCalculationsHelper } from 'src/app/shared/utils/helpers/methods-calculations.helper';

// components
import { ApplicantSphModalComponent } from './components/applicant-sph-modal/applicant-sph-modal.component';

// services
import { ImageBase64Service } from 'src/app/shared/services/image-base64.service';
import { TaInputService } from 'src/app/shared/components/ta-input/services/ta-input.service';
import { ModalService } from 'src/app/shared/components/ta-modal/services/modal.service';
import { ApplicantService } from '../../services/applicant.service';

// store
import { ApplicantQuery } from '../../state/applicant.query';
import { ApplicantStore } from '../../state/applicant.store';

// enums
import { InputSwitchActions } from '../../enums/input-switch-actions.enum';
import { SelectedMode } from '../../enums/selected-mode.enum';

// models
import {
    ApplicantResponse,
    CreateSphReviewCommand,
    SphFeedbackResponse,
    UpdateSphCommand,
} from 'appcoretruckassist';

@Component({
    selector: 'app-sph',
    templateUrl: './applicant-sph.component.html',
    styleUrls: ['./applicant-sph.component.scss'],
})
export class ApplicantSphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.REVIEW;

    public isValidLoad: boolean;

    public sphForm: UntypedFormGroup;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public applicantCardInfo: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private modalService: ModalService,
        private inputService: TaInputService,
        private router: Router,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private applicantActionsService: ApplicantService,
        private imageBase64Service: ImageBase64Service,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.sphForm = this.formBuilder.group({
            isTested: [false, Validators.requiredTrue],
            hasReadAndUnderstood: [false, Validators.requiredTrue],
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
                    const personalInfo = res.personalInfo;

                    this.applicantCardInfo = {
                        name: personalInfo?.fullName,
                        ssn: personalInfo?.ssn,
                        dob: MethodsCalculationsHelper.convertDateFromBackend(
                            personalInfo?.doB
                        ),
                    };

                    this.applicantId = res.id;

                    if (res.sph) {
                        this.patchStepValues(res.sph);
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/website']);
                }
            });
    }

    public patchStepValues(stepValues: SphFeedbackResponse): void {
        const { authorize, hasReadAndUnderstood, signature } = stepValues;

        this.sphForm.patchValue({
            isTested: authorize,
            hasReadAndUnderstood,
        });

        this.signatureImgSrc = signature;
        this.signature = signature;
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (this.selectedMode !== SelectedMode.APPLICANT) {
            return;
        }

        switch (type) {
            case InputSwitchActions.IS_TESTED:
                this.sphForm.patchValue({
                    isTested: !this.sphForm.get('isTested').value,
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

    public handleReviewSectionsClick(): void {
        this.modalService.openModal(
            ApplicantSphModalComponent,
            {
                size: 'sph-applicant',
            },
            null,
            'sph-applicant-backdrop'
        );
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
        if (this.sphForm.invalid || !this.signature) {
            if (this.sphForm.invalid) {
                this.inputService.markInvalid(this.sphForm);
            }

            if (!this.signature) {
                this.displaySignatureRequiredNote = true;
            }

            return;
        }

        const { isTested, hasReadAndUnderstood } = this.sphForm.value;

        const saveData: UpdateSphCommand = {
            applicantId: this.applicantId,
            authorize: isTested,
            hasReadAndUnderstood,
            signature:
                this.selectedMode === SelectedMode.APPLICANT
                    ? this.signature
                    : this.signatureImgSrc,
        };

        this.applicantActionsService
            .updateSph(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/hos-rules/${this.applicantId}`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                sph: {
                                    ...store.applicant.sph,
                                    authorize: saveData.authorize,
                                    hasReadAndUnderstood:
                                        saveData.hasReadAndUnderstood,
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
        const saveData: CreateSphReviewCommand = {
            applicantId: this.applicantId,
        };

        this.applicantActionsService
            .createSphReview(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([`/hos-rules/${this.applicantId}`]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                sph: {
                                    ...store.applicant.sph,
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
