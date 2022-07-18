import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

@Component({
  selector: 'app-psp-authorization',
  templateUrl: './psp-authorization.component.html',
  styleUrls: ['./psp-authorization.component.scss'],
})
export class PspAuthorizationComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public pspAuthorizationForm: FormGroup;

  public signature: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.pspAuthorizationForm = this.formBuilder.group({
      isConfirm: [false, Validators.required],
      isAuthorize: [false, Validators.required],
      isFurtherUnderstand: [false, Validators.required],
      isPspReport: [false, Validators.required],
      isDisclosureRegardingReport: [false, Validators.required],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    switch (type) {
      case InputSwitchActions.IS_AUTHORIZE:
        this.pspAuthorizationForm.patchValue({
          isAuthorize: !this.pspAuthorizationForm.get('isAuthorize').value,
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
          isPspReport: !this.pspAuthorizationForm.get('isPspReport').value,
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
    this.signature = event;
  }
}
