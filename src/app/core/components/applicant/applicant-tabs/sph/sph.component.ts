import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from './../../../../utils/methods.calculations';

import { SphModalComponent } from './sph-modal/sph-modal.component';

<<<<<<< HEAD
import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
=======
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
>>>>>>> develop

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    SphFeedbackResponse,
    UpdateSphCommand,
} from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
<<<<<<< HEAD
import { SelectedMode } from '../../state/enum/selected-mode.enum';
=======
import { ApplicantResponse } from 'appcoretruckassist';
>>>>>>> develop

@Component({
    selector: 'app-sph',
    templateUrl: './sph.component.html',
    styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public sphForm: FormGroup;

<<<<<<< HEAD
    public applicantId: number;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;
=======
    public signature: any;
>>>>>>> develop

    public applicantCardInfo: any;

    constructor(
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private inputService: TaInputService,
        private applicantQuery: ApplicantQuery
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getStepValuesFromStore();
    }

    public createForm(): void {
        this.sphForm = this.formBuilder.group({
            isTested: [false, Validators.requiredTrue],
            hasReadAndUnderstood: [false, Validators.requiredTrue],
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
<<<<<<< HEAD

                this.applicantId = res.id;

                if (res.sph) {
                    this.patchStepValues(res.sph);
                }
=======
>>>>>>> develop
            });
    }

    public patchStepValues(stepValues: SphFeedbackResponse): void {
        console.log('stepValues', stepValues);
        const { authorize, hasReadAndUnderstood, signature } = stepValues;

        this.sphForm.patchValue({
            isTested: authorize,
            hasReadAndUnderstood,
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
        this.signature = event;
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
            if (this.selectedMode === SelectedMode.APPLICANT) {
                this.onSubmit();
            }

            if (this.selectedMode === SelectedMode.REVIEW) {
                this.onSubmitReview();
            }
        }
    }

    public onSubmit(): void {
<<<<<<< HEAD
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
=======
        if (this.sphForm.invalid) {
            this.inputService.markInvalid(this.sphForm);
            return;
        }
>>>>>>> develop
    }

    public onSubmitReview(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
