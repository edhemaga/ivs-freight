import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import moment from 'moment';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

import { Subject, takeUntil } from 'rxjs';

import { ApplicantActionsService } from './../state/services/applicant-actions.service';

import {
  AcceptApplicationCommand,
  ApplicantCompanyInfoResponse,
  VerifyApplicantCommand,
} from 'appcoretruckassist';

@Component({
  selector: 'app-applicant-welcome-screen',
  templateUrl: './applicant-welcome-screen.component.html',
  styleUrls: ['./applicant-welcome-screen.component.scss'],
})
export class ApplicantWelcomeScreenComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  private verifyData: VerifyApplicantCommand;

  public dateOfApplication: string;
  public copyrightYear: string;

  public companyInfo: ApplicantCompanyInfoResponse;

  private applicantId: AcceptApplicationCommand;

  constructor(
    private route: ActivatedRoute,
    private applicantActionsService: ApplicantActionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.copyrightYear = moment().format('YYYY');

    this.getQueryParams();

    this.applicantActionsService
      .verifyApplicant(this.verifyData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.dateOfApplication = convertDateFromBackend(
            res.inviteDate
          ).replace(/-/g, '/');

          this.companyInfo = res.companyInfo;

          this.applicantId = { id: res.personalInfo.applicantId };
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public getQueryParams() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        this.verifyData = {
          inviteCode: params['InviteCode'].split(' ').join('+'),
        };
      });
  }

  public onStartApplication(): void {
    this.applicantActionsService
      .acceptApplicant(this.applicantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId.id}/1`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
