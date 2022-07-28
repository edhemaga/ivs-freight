import { Component, OnInit, OnDestroy } from '@angular/core';

import { untilDestroyed } from 'ngx-take-until-destroy';

import moment from 'moment';

import { SelectedMode } from '../state/enum/selected-mode.enum';
import { CompanyInfoModel } from '../state/model/company.model';

import { ApplicantActionsService } from './../state/services/applicant-actions.service';

@Component({
  selector: 'app-applicant-footer',
  templateUrl: './applicant-footer.component.html',
  styleUrls: ['./applicant-footer.component.scss'],
})
export class ApplicantFooterComponent implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.REVIEW;

  public copyrightYear: string;

  public companyInfo: CompanyInfoModel;

  public displayInfoBox: boolean = false;
  public displayDocumentsBox: boolean = false;

  public selectedTab: number = 1;

  public tabs: any[] = [
    {
      id: 1,
      name: 'CDL',
    },
    {
      id: 2,
      name: 'SSN',
    },
    {
      id: 3,
      name: 'Medical',
    },
    {
      id: 4,
      name: 'MVR',
    },
  ];

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

  public onDisplayOrHideDocumentsBox(): void {
    this.displayDocumentsBox = !this.displayDocumentsBox;
  }

  public getCompanyInfo() {
    this.applicantActionsService.getApplicantInfo$
      .pipe(untilDestroyed(this))
      .subscribe((data) => {
        this.companyInfo = data.companyInfo;
      });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
  }

  ngOnDestroy(): void {}
}
