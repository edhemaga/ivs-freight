import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

@Component({
  selector: 'app-mvr-authorization',
  templateUrl: './mvr-authorization.component.html',
  styleUrls: ['./mvr-authorization.component.scss'],
})
export class MvrAuthorizationComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public mvrAuthorizationForm: FormGroup;
  public dontHaveMvrForm: FormGroup;

  public signature: any;

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
    });

    this.dontHaveMvrForm = this.formBuilder.group({
      dontHaveMvr: [false],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
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
}
