import { Component, OnInit, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

import { CompanyInfoModel } from '../state/model/company.model';

import { ApplicantActionsService } from './../state/services/applicant-actions.service';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit, OnDestroy {
  public copyrightYear: string;

  public companyInfo: CompanyInfoModel;

  public displayInfoBox: boolean = false;

  constructor(private applicantActionsService: ApplicantActionsService) {}

  ngOnInit(): void {
    this.copyrightYear = moment().format('YYYY');

    this.getCompanyInfo();
  }

  public onHideInfoBox(): void {
    this.displayInfoBox = false;
  }

  public onDisplayOrHideInfoBox(): void {
    this.displayInfoBox = !this.displayInfoBox;
  }

  public getCompanyInfo() {
    this.applicantActionsService.getApplicantInfo$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.companyInfo = data.companyInfo;
      });
  }

  ngOnDestroy(): void {}
}
