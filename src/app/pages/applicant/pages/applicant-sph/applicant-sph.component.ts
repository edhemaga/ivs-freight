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
import { ApplicantMapper } from '@pages/applicant/utils/helpers/applicant.mapper';

// components
import { ApplicantSphModalComponent } from '@pages/applicant/pages/applicant-sph/components/applicant-sph-modal/applicant-sph-modal.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { ApplicantWorkExperienceTableComponent } from '@pages/applicant/components/applicant-work-experience-table/applicant-work-experience-table/applicant-work-experience-table.component';
import { ApplicantNextBackBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-next-back-btn/applicant-next-back-btn.component';

// services
import { ImageBase64Service } from '@shared/services/image-base64.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { ApplicantService } from '@pages/applicant/services/applicant.service';

// store
import { ApplicantQuery } from '@pages/applicant/state/applicant.query';
import { ApplicantStore } from '@pages/applicant/state/applicant.store';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';
import { StepAction } from '@pages/applicant/enums/step-action.enum';

// models
import {
    ApplicantResponse,
    CreateSphReviewCommand,
    PersonalInfoFeedbackResponse,
    SphFeedbackResponse,
    UpdateSphCommand,
} from 'appcoretruckassist';
import { WorkExperienceItemMapped } from '@pages/applicant/models/work-experience-mapped.model';

// modules
import { ApplicantModule } from '@pages/applicant/applicant.module';
import { SharedModule } from '@shared/shared.module';
import { ApplicantCardComponent } from '@pages/applicant/components/applicant-card/applicant-card.component';

@Component({
    selector: 'app-sph',
    templateUrl: './applicant-sph.component.html',
    styleUrls: ['./applicant-sph.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        SharedModule,
        ApplicantModule,

        // components
        TaCheckboxComponent,
        ApplicantSphModalComponent,
        ApplicantCardComponent,
        ApplicantWorkExperienceTableComponent,
        ApplicantNextBackBtnComponent
    ],
})
export class ApplicantSphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string;

    public isValidLoad: boolean;

    public sphForm: UntypedFormGroup;

    public applicantId: number;
    public queryParamId: number | string | null = null;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public applicantCardInfo: PersonalInfoFeedbackResponse;
    public companyName: string;

    public workExperienceArray: WorkExperienceItemMapped[] = [];

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
        this.initMode();

        this.getQueryParams();

        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.sphForm = this.formBuilder.group({
            isTested: [false, Validators.requiredTrue],
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

                    if (res.sph) {
                        this.patchStepValues(res.sph);
                    }

                    if (res.workExperience) {
                        this.workExperienceArray =
                            ApplicantMapper.mapWorkExperienceItems(
                                res.workExperience.workExperienceItems
                            );
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
        if (event.action === StepAction.NEXT_STEP) {
            if (this.selectedMode !== SelectedMode.REVIEW) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }

        if (event.action === StepAction.BACK_STEP) {
            this.router.navigate([`/psp-authorization/${this.applicantId}`]);
        }
    }

    public onSubmit(): void {
        debugger;
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
