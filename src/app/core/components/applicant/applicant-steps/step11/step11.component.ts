import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import { Authorization } from '../../state/model/authorization.model';

@Component({
  selector: 'app-step11',
  templateUrl: './step11.component.html',
  styleUrls: ['./step11.component.scss'],
})
export class Step11Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  public authorizationForm: FormGroup;

  public signature: any;

  public authorizationInfo: Authorization | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public createForm(): void {
    this.authorizationForm = this.formBuilder.group({
      isFirstAuthorization: [false, Validators.requiredTrue],
      isSecondAuthorization: [false, Validators.requiredTrue],
      isThirdAuthorization: [false, Validators.requiredTrue],
      isFourthAuthorization: [false, Validators.requiredTrue],
    });
  }

  public handleCheckboxParagraphClick(type: string) {
    switch (type) {
      case InputSwitchActions.FIRST_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isFirstAuthorization: !this.authorizationForm.get(
            'isFirstAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.SECOND_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isSecondAuthorization: !this.authorizationForm.get(
            'isSecondAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.THIRD_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isThirdAuthorization: !this.authorizationForm.get(
            'isThirdAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.FOURTH_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isFourthAuthorization: !this.authorizationForm.get(
            'isFourthAuthorization'
          ).value,
        });

        break;

      default:
        break;
    }
  }

  public onSignatureAction(event: any): void {
    console.log(event);
    /* this.signature =  event.signature.toDataURL(); */
  }

  private formFilling(): void {
    this.authorizationForm.patchValue({
      isFirstAuthorization: this.authorizationInfo?.isFirstAuthorization,
      isSecondAuthorization: this.authorizationInfo?.isSecondAuthorization,
      isThirdAuthorization: this.authorizationInfo?.isThirdAuthorization,
      isFourthAuthorization: this.authorizationInfo?.isFourthAuthorization,
    });

    this.signature = this.authorizationInfo?.signature;
  }

  public onSubmitForm(): void {
    /* if (!this.signatureToSave && !this.signature) {
        this.notification.warning('Please give youre signature', 'Warning:');
        return false;
      } else if (this.signatureToSave) {
        authorization.signature = this.signature;
      }
 */

    const authorizationForm = this.authorizationForm.value;
    const authorization = new Authorization(this.authorizationInfo);

    authorization.applicantId = this.applicant?.id;

    authorization.isFirstAuthorization = authorizationForm.isFirstAuthorization;
    authorization.isSecondAuthorization =
      authorizationForm.isSecondAuthorization;
    authorization.isThirdAuthorization = authorizationForm.isThirdAuthorization;
    authorization.isFourthAuthorization =
      authorizationForm.isFourthAuthorization;

    /*   this.apppEntityServices.AuthorizationService.upsert(
        authorization
      ).subscribe(
        () => {
          this.notification.success('Authorization is updated');
        },
        (error: any) => {
          this.shared.handleError(error);
        }
      ); */
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmitForm();
    }
  }

  public onSubmitReview(data: any): void {}

  ngOnDestroy(): void {}
}
