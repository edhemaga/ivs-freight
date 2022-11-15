import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';
import { ImageBase64Service } from 'src/app/core/utils/base64.image';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantResponse } from 'appcoretruckassist';

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

  public stepHasValues: boolean = false;

  public lastValidLicense: any;

  public previousStepValues: any;

  public documents: any[] = [];

  public signature: string;
  public signatureImgSrc: string;

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
          cdlInformation?.licences[cdlInformation.licences.length - 1];

        this.lastValidLicense = {
          license: lastLicenseAdded?.licenseNumber,
          state: lastLicenseAdded?.state?.stateShortName,
          classType: lastLicenseAdded?.classType?.name,
          expDate: convertDateFromBackend(lastLicenseAdded?.expDate),
        };

        this.lastValidLicense.name = personalInfo?.fullName;

        this.applicantId = res.id;

        /* this.stepHasValues = true; */
      });
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
    if (
      this.selectedMode === SelectedMode.FEEDBACK ||
      this.selectedMode === SelectedMode.REVIEW
    ) {
      return;
    }

    switch (type) {
      case InputSwitchActions.CONSENT_RELEASE:
        this.mvrAuthorizationForm.patchValue({
          isConsentRelease:
            !this.mvrAuthorizationForm.get('isConsentRelease').value,
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

  public onFilesAction(event: any): void {
    this.documents = event.files;

    switch (event.action) {
      case 'add':
        this.mvrAuthorizationForm
          .get('files')
          .patchValue(JSON.stringify(event.files));

        break;
      case 'delete':
        this.mvrAuthorizationForm
          .get('files')
          .patchValue(event.files.length ? JSON.stringify(event.files) : null);

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
      const isAnyInputInLineIncorrect = anyInputInLineIncorrect(lineInputItems);

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
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = false;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        true;
    } else {
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = true;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        false;
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
  }

  public onSubmit(): void {
    if (this.mvrAuthorizationForm.invalid) {
      this.inputService.markInvalid(this.mvrAuthorizationForm);
      return;
    }

    if (!this.signature) {
      return;
    }

    const {
      isConsentRelease,
      isPeriodicallyObtained,
      isInformationCorrect,
      licenseCheck,
    } = this.mvrAuthorizationForm.value;

    const { dontHaveMvr } = this.dontHaveMvrForm.value;

    const documents = this.documents.map((item) => {
      return item.realFile;
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
    };

    const selectMatchingBackendMethod = () => {
      if (this.selectedMode === SelectedMode.APPLICANT && !this.stepHasValues) {
        return this.applicantActionsService.createMvrAuthorization(saveData);
      }

      if (
        (this.selectedMode === SelectedMode.APPLICANT && this.stepHasValues) ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        return this.applicantActionsService.updateMvrAuthorization(saveData);
      }
    };

    selectMatchingBackendMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/psp-authorization/${this.applicantId}`]);
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
