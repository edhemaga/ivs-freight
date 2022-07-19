import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

/* import { AcceptApplicationCommand } from 'appcoretruckassist';
 */
import { ApplicantActionsService } from './../state/services/applicant-actions.service';

@Component({
  selector: 'app-applicant-welcome-screen',
  templateUrl: './applicant-welcome-screen.component.html',
  styleUrls: ['./applicant-welcome-screen.component.scss'],
})
export class ApplicantWelcomeScreenComponent implements OnInit, OnDestroy {
  public currentDate: string;
  public copyrightYear: string;

  /*  private verifyData: AcceptApplicationCommand;
   */
  private applicantId: number;

  public company: any = {
    name: 'JD FREIGHT INC',
    usdot: 245326,
    phoneContact: '(621) 321-2232',
    location: {
      street: '4747 Research Forest Dr # 185',
      city: 'The Woodlands',
      postalCode: 'TX 77381',
      country: 'USA 1',
    },
  };

  constructor(
    private route: ActivatedRoute,
    private applicantActionsService: ApplicantActionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentDate = moment().format('MM/DD/YY');
    this.copyrightYear = moment().format('YYYY');

    this.route.queryParams.subscribe((params) => {
      /*  this.verifyData = {
        inviteCode: params['InviteCode'].split(' ').join('+'),
      }; */
    });
  }

  public onStartApplication(): void {
    /*  this.applicantActionsService
      .acceptApplicant(this.verifyData)
      .pipe(untilDestroyed(this))
      .subscribe((res: any) => {
        this.applicantActionsService.getApplicantInfo(res);

        this.applicantId = res.personalInfo.applicantId;

        this.router.navigate([`/applicant/${this.applicantId}/1`]);
      }); */
  }

  ngOnDestroy(): void {}
}
