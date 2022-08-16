import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

@Component({
  selector: 'app-mvr-authorization',
  templateUrl: './mvr-authorization.component.html',
  styleUrls: ['./mvr-authorization.component.scss'],
})
export class MvrAuthorizationComponent implements OnInit {
  public selectedMode: string = SelectedMode.FEEDBACK;

  public mvrAuthorizationForm: FormGroup;
  public dontHaveMvrForm: FormGroup;

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.mvrAuthorizationForm = this.formBuilder.group({
      isConsentRelease: [false, Validators.required],
      isPeriodicallyObtained: [false, Validators.required],
      isInformationCorrect: [false, Validators.required],
      licenseCheck: [false, Validators.required],

      firstRowReview: [null],
    });

    this.dontHaveMvrForm = this.formBuilder.group({
      dontHaveMvr: [false],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
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
}
