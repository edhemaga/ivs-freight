import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from './../../../../utils/methods.calculations';

import { SphModalComponent } from './sph-modal/sph-modal.component';

import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    CreateSphReviewCommand,
    SphFeedbackResponse,
    UpdateSphCommand,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
    selector: 'app-sph',
    templateUrl: './sph.component.html',
    styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public isValidLoad: boolean;

    public sphForm: FormGroup;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public applicantCardInfo: any;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: ModalService,
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
                        dob: convertDateFromBackend(personalInfo?.doB),
                    };

                    this.applicantId = res.id;

                    if (res.sph) {
                        this.patchStepValues(res.sph);
                    }
                } else {
                    this.isValidLoad = false;

                    this.router.navigate(['/auth']);
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
            SphModalComponent,
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
