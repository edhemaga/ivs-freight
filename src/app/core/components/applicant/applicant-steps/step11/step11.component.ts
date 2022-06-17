import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  public authorizationForm!: FormGroup;
  public authorizationInfo: Authorization | undefined;

  public signature: any;
  public signatureToSave: any;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public formInit(): void {
    this.authorizationForm = this.formBuilder.group({
      isFirstAuthorization: [false, Validators.requiredTrue],
      isSecondAuthorization: [false, Validators.requiredTrue],
      isThirdAuthorization: [false, Validators.requiredTrue],
      isFourthAuthorization: [false, Validators.requiredTrue],
    });
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

  public onSignatureAction(event: any): void {
    this.signatureToSave = event.signature
      ? event.signature.toDataURL()
      : undefined;
    this.signature = event.signature ? event.signature.toDataURL() : undefined;
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
