import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { ImageBase64Service } from 'src/app/core/utils/base64.image';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import { ApplicantResponse, MvrAuthFeedbackResponse } from 'appcoretruckassist';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
    selector: 'app-mvr-authorization',
    templateUrl: './mvr-authorization.component.html',
    styleUrls: ['./mvr-authorization.component.scss'],
})
export class MvrAuthorizationComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public mvrAuthorizationForm: FormGroup;
    public dontHaveMvrForm: FormGroup;

    public applicantId: number;
    public mvrAuthId: number | null = null;

    public stepHasValues: boolean = false;

    public lastValidLicense: any;

    public previousStepValues: any;

    public documents: any[] = [];
    public documentsForDeleteIds: number[] = [];
    public displayDocumentsRequiredNote: boolean = false;

    public signature: string;
    public signatureImgSrc: string;
    public displaySignatureRequiredNote: boolean = false;

    public openAnnotationArray: {
        lineIndex?: number;
        lineInputs?: boolean[];
        displayAnnotationButton?: boolean;
        displayAnnotationTextArea?: boolean;
    }[] = [
        {
            lineIndex: 0,
            lineInputs: [false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public hasIncorrectFields: boolean = false;

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

        this.requestDrivingRecordFromEmployer();
    }

    private createForm(): void {
        this.mvrAuthorizationForm = this.formBuilder.group({
            isConsentRelease: [false, Validators.requiredTrue],
            isPeriodicallyObtained: [false, Validators.requiredTrue],
            isInformationCorrect: [false, Validators.requiredTrue],
            licenseCheck: [false, Validators.requiredTrue],
            files: [null, Validators.required],

            firstRowReview: [null],
        });

        this.dontHaveMvrForm = this.formBuilder.group({
            dontHaveMvr: [false, Validators.required],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicant$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantResponse) => {
                const personalInfo = res.personalInfo;
                const cdlInformation = res.cdlInformation;

                const lastLicenseAdded =
                    cdlInformation?.licences[
                        cdlInformation.licences.length - 1
                    ];

                this.lastValidLicense = {
                    license: lastLicenseAdded?.licenseNumber,
                    state: lastLicenseAdded?.state?.stateShortName,
                    classType: lastLicenseAdded?.classType?.name,
                    expDate: convertDateFromBackend(lastLicenseAdded?.expDate),
                };

                this.lastValidLicense.name = personalInfo?.fullName;

                this.applicantId = res.id;

                if (res.mvrAuth) {
                    this.patchStepValues(res.mvrAuth);

                    this.stepHasValues = true;
                }
            });
    }

    public patchStepValues(stepValues: MvrAuthFeedbackResponse): void {
        console.log('stepValues', stepValues);
        const {
            isEmployee,
            isPeriodicallyObtained,
            isInformationCorrect,
            dontHaveMvr,
            onlyLicense,
            signature,
            files,
            id,
        } = stepValues;

        this.mvrAuthId = id;

        this.mvrAuthorizationForm.patchValue({
            isConsentRelease: isEmployee,
            isPeriodicallyObtained,
            isInformationCorrect,
            licenseCheck: onlyLicense,
            files: files ? JSON.stringify(files) : null,
        });

        this.signatureImgSrc = signature;
        this.signature = signature;

        this.documents = files;

        this.dontHaveMvrForm.get('dontHaveMvr').patchValue(dontHaveMvr);

        if (dontHaveMvr) {
            this.inputService.changeValidators(
                this.mvrAuthorizationForm.get('files'),
                false
            );
        } else {
            this.inputService.changeValidators(
                this.mvrAuthorizationForm.get('files')
            );
        }
    }

    public requestDrivingRecordFromEmployer(): void {
        this.dontHaveMvrForm
            .get('dontHaveMvr')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    const { files } = this.mvrAuthorizationForm.value;

                    this.previousStepValues = {
                        files,
                    };

                    this.inputService.changeValidators(
                        this.mvrAuthorizationForm.get('files'),
                        false
                    );
                } else {
                    if (this.previousStepValues) {
                        const { files } = this.previousStepValues;

                        this.mvrAuthorizationForm.patchValue({
                            files,
                        });
                    }

                    this.inputService.changeValidators(
                        this.mvrAuthorizationForm.get('files')
                    );
                }
            });
    }

    public handleCheckboxParagraphClick(type: string): void {
        if (this.selectedMode !== SelectedMode.APPLICANT) {
            return;
        }

        switch (type) {
            case InputSwitchActions.CONSENT_RELEASE:
                this.mvrAuthorizationForm.patchValue({
                    isConsentRelease:
                        !this.mvrAuthorizationForm.get('isConsentRelease')
                            .value,
                });

                break;
            case InputSwitchActions.PERIODICALLY_OBTAINED:
                this.mvrAuthorizationForm.patchValue({
                    isPeriodicallyObtained: !this.mvrAuthorizationForm.get(
                        'isPeriodicallyObtained'
                    ).value,
                });

                break;
            case InputSwitchActions.INFORMATION_CORRECT:
                this.mvrAuthorizationForm.patchValue({
                    isInformationCorrect: !this.mvrAuthorizationForm.get(
                        'isInformationCorrect'
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

    public onFilesAction(event: any): void {
        this.documents = event.files;

        this.displayDocumentsRequiredNote = false;

        switch (event.action) {
            case 'add':
                this.mvrAuthorizationForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));

                break;
            case 'delete':
                this.mvrAuthorizationForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );

                this.documentsForDeleteIds = [
                    ...this.documentsForDeleteIds,
                    event.deleteId,
                ];

                break;

            default:
                break;
        }
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (event) {
            selectedInputsLine.lineInputs[inputIndex] = true;

            if (!selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = true;
                selectedInputsLine.displayAnnotationTextArea = false;
            }
        }

        if (!event) {
            selectedInputsLine.lineInputs[inputIndex] = false;

            const lineInputItems = selectedInputsLine.lineInputs;
            const isAnyInputInLineIncorrect =
                anyInputInLineIncorrect(lineInputItems);

            if (!isAnyInputInLineIncorrect) {
                selectedInputsLine.displayAnnotationButton = false;
                selectedInputsLine.displayAnnotationTextArea = false;
            }
        }

        const inputFieldsArray = JSON.stringify(
            this.openAnnotationArray
                .filter((item) => Object.keys(item).length !== 0)
                .map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.hasIncorrectFields = true;
        } else {
            this.hasIncorrectFields = false;
        }
    }

    public getAnnotationBtnClickValue(event: any): void {
        if (event.type === 'open') {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                false;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = true;
        } else {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                true;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = false;
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
        if (this.mvrAuthorizationForm.invalid || !this.signature) {
            if (this.mvrAuthorizationForm.invalid) {
                this.inputService.markInvalid(this.mvrAuthorizationForm);

                if (!this.documents.length) {
                    this.displayDocumentsRequiredNote = true;
                }
            }

            if (!this.signature) {
                this.displaySignatureRequiredNote = true;
            }

            return;
        }

        const {
            isConsentRelease,
            isPeriodicallyObtained,
            isInformationCorrect,
            licenseCheck,
        } = this.mvrAuthorizationForm.value;

        const { dontHaveMvr } = this.dontHaveMvrForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const saveData: any = {
            applicantId: this.applicantId,
            isEmployee: isConsentRelease,
            isPeriodicallyObtained,
            isInformationCorrect,
            dontHaveMvr,
            onlyLicense: licenseCheck,
            signature:
                this.selectedMode === SelectedMode.APPLICANT
                    ? this.signature
                    : this.signatureImgSrc,
            files: dontHaveMvr ? [] : documents,
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.mvrAuthId,
                filesForDeleteIds: this.documentsForDeleteIds,
            }),
        };

        console.log('saveData', saveData);

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createMvrAuthorization(
                    saveData
                );
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateMvrAuthorization(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/psp-authorization/${this.applicantId}`,
                    ]);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                mvrAuth: {
                                    ...store.applicant.mvrAuth,
                                    isEmployee: saveData.isEmployee,
                                    isPeriodicallyObtained:
                                        saveData.isPeriodicallyObtained,
                                    isInformationCorrect:
                                        saveData.isInformationCorrect,
                                    dontHaveMvr: saveData.dontHaveMvr,
                                    onlyLicense: saveData.onlyLicense,
                                    signature: saveData.signature,
                                    files: saveData.files,
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

    public onSubmitReview(): void {}

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
