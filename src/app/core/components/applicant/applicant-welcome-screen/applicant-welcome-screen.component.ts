import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import moment from 'moment';

import { ICompany } from '../state/model/company.model';

@Component({
  selector: 'app-applicant-welcome-screen',
  templateUrl: './applicant-welcome-screen.component.html',
  styleUrls: ['./applicant-welcome-screen.component.scss'],
})
export class ApplicantWelcomeScreenComponent implements OnInit {
  public currentDate: string;
  public copyrightYear: string;

  public company: ICompany = {
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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.currentDate = moment().format('MM/DD/YY');
    this.copyrightYear = moment().format('YYYY');

    this.route.queryParams.subscribe((params) => {
      console.log(params);
    });
  }
}
