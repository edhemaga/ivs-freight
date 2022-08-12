import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import { DisclosureRelease } from '../../state/model/disclosure-release.model';

@Component({
  selector: 'app-step10',
  templateUrl: './step10.component.html',
  styleUrls: ['./step10.component.scss'],
})
export class Step10Component implements OnInit {
  public selectedMode: string = SelectedMode.REVIEW;

  public applicant: Applicant | undefined;

  public disclosureReleaseForm: FormGroup;

  public disclosureReleaseInfo: DisclosureRelease | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public createForm(): void {
    this.disclosureReleaseForm = this.formBuilder.group({
      isFirstDisclosure: [false, Validators.requiredTrue],
      isSecondDisclosure: [false, Validators.requiredTrue],
      isThirdDisclosure: [false, Validators.requiredTrue],
      isFourthDisclosure: [false, Validators.requiredTrue],
      isFifthDisclosure: [false, Validators.requiredTrue],
      isSixthDisclosure: [false, Validators.requiredTrue],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
      return;
    }

    switch (type) {
      case InputSwitchActions.FIRST_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isFirstDisclosure:
            !this.disclosureReleaseForm.get('isFirstDisclosure').value,
        });

        break;
      case InputSwitchActions.SECOND_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isSecondDisclosure:
            !this.disclosureReleaseForm.get('isSecondDisclosure').value,
        });

        break;
      case InputSwitchActions.THIRD_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isThirdDisclosure:
            !this.disclosureReleaseForm.get('isThirdDisclosure').value,
        });

        break;
      case InputSwitchActions.FOURTH_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isFourthDisclosure:
            !this.disclosureReleaseForm.get('isFourthDisclosure').value,
        });

        break;
      case InputSwitchActions.FIFTH_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isFifthDisclosure:
            !this.disclosureReleaseForm.get('isFifthDisclosure').value,
        });

        break;
      case InputSwitchActions.SIXTH_DISCLOSURE:
        this.disclosureReleaseForm.patchValue({
          isSixthDisclosure:
            !this.disclosureReleaseForm.get('isSixthDisclosure').value,
        });

        break;
      default:
        break;
    }
  }

  private formFilling(): void {
    this.disclosureReleaseForm.patchValue({
      isFirstDisclosure: this.disclosureReleaseInfo?.isFirstDisclosure,
      isSecondDisclosure: this.disclosureReleaseInfo?.isSecondDisclosure,
      isThirdDisclosure: this.disclosureReleaseInfo?.isThirdDisclosure,
      isFourthDisclosure: this.disclosureReleaseInfo?.isFourthDisclosure,
      isFiftyDisclosure: this.disclosureReleaseInfo?.isFifthDisclosure,
      isSixDisclosure: this.disclosureReleaseInfo?.isSixthDisclosure,
    });
  }

  public onSubmitForm(): void {
    const disclosureReleaseForm = this.disclosureReleaseForm.value;
    const disclosureRelease = new DisclosureRelease(this.disclosureReleaseInfo);

    disclosureRelease.applicantId = this.applicant?.id;

    disclosureRelease.isFirstDisclosure =
      disclosureReleaseForm.isFirstDisclosure;
    disclosureRelease.isSecondDisclosure =
      disclosureReleaseForm.isSecondDisclosure;
    disclosureRelease.isThirdDisclosure =
      disclosureReleaseForm.isThirdDisclosure;
    disclosureRelease.isFourthDisclosure =
      disclosureReleaseForm.isFourthDisclosure;
    disclosureRelease.isFifthDisclosure =
      disclosureReleaseForm.isFifthDisclosure;
    disclosureRelease.isSixthDisclosure =
      disclosureReleaseForm.isSixthDisclosure;

    /* this.apppEntityServices.DisclosureReleaseService.upsert(
        disclosureRelease
      ).subscribe(
        () => {
          this.notification.success('Disclosure Release is updated');
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
}
