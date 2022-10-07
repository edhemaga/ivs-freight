import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

@Component({
  selector: 'app-mvr-authorization',
  templateUrl: './mvr-authorization.component.html',
  styleUrls: ['./mvr-authorization.component.scss'],
})
export class MvrAuthorizationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.REVIEW;

  public mvrAuthorizationForm: FormGroup;
  public dontHaveMvrForm: FormGroup;

  public lastValidLicense: any;

  public documents: any[] = [];

  public signature: any;

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
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.applicantQuery.cdlInformationList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        const lastLicenseAdded = res.licences[res.licences.length - 1];

        this.lastValidLicense = {
          license: lastLicenseAdded.licenseNumber,
          state: lastLicenseAdded.state.stateShortName,
          /*  classType: lastLicenseAdded._class.name, */
          expDate: convertDateFromBackend(lastLicenseAdded.expDate),
        };
      });

    this.applicantQuery.personalInfoList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.lastValidLicense.name = res.fullName;
      });
  }

  private createForm(): void {
    this.mvrAuthorizationForm = this.formBuilder.group({
      isConsentRelease: [false, Validators.requiredTrue],
      isPeriodicallyObtained: [false, Validators.requiredTrue],
      isInformationCorrect: [false, Validators.requiredTrue],
      licenseCheck: [false, Validators.requiredTrue],

      firstRowReview: [null],
    });

    this.dontHaveMvrForm = this.formBuilder.group({
      dontHaveMvr: [false],
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
    this.signature = event;
  }

  public onFilesAction(event: any): void {
    this.documents = event.files;
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
      if (this.selectedMode === SelectedMode.APPLICANT) {
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
  }

  public onSubmitReview(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
