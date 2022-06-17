import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import { DriverRights } from '../../state/model/driver-rights.model';

@Component({
  selector: 'app-step9',
  templateUrl: './step9.component.html',
  styleUrls: ['./step9.component.scss'],
})
export class Step9Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public driverRightsForm: FormGroup;
  public driverRightsInfo: DriverRights | undefined;

  public applicant: Applicant | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public formInit(): void {
    this.driverRightsForm = this.formBuilder.group({
      understandYourRights: [false, Validators.requiredTrue],
    });
  }

  public onSubmitForm(): void {
    const driverRightsForm = this.driverRightsForm.value;
    const driverRights = new DriverRights(this.driverRightsInfo);

    driverRights.applicantId = this.applicant?.id;
    driverRights.understandYourRights = driverRightsForm.understandYourRights;

    /*  this.apppEntityServices.DriverRightService.upsert(driverRight).subscribe(
        () => {
          this.notification.success('Driver Right is updated');
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

  ngOnDestroy(): void {}
}
