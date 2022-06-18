import { Component, OnInit } from '@angular/core';

import moment from 'moment';

import { ICompany } from 'src/app/core/components/applicant/state/model/company.model';
import { INavigation } from 'src/app/core/components/applicant/state/model/navigation.model';
import { Applicant } from 'src/app/core/components/applicant/state/model/applicant.model';

@Component({
  selector: 'app-applicant-header',
  templateUrl: './applicant-header.component.html',
  styleUrls: ['./applicant-header.component.scss'],
})
export class ApplicantHeaderComponent implements OnInit {
  public applicant!: Applicant;

  public currentDate: string = moment().format('MM/DD/YY');

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

  public menuItems: INavigation[] = [
    {
      title: 'Application',
      iconSrc: 'assets/svg/applicant/user.svg',
      route: 'application',
    },
    {
      title: 'Medical Cert.',
      iconSrc: 'assets/svg/applicant/medical.svg',
      route: 'medical-certificate',
    },
    {
      title: 'MVR Auth.',
      iconSrc: 'assets/svg/applicant/car.svg',
      route: 'mvr-authorization',
    },
    {
      title: 'PSP Auth.',
      iconSrc: 'assets/svg/applicant/case.svg',
      route: 'psp-authorization',
    },
    {
      title: 'SPH',
      iconSrc: 'assets/svg/applicant/shield.svg',
      route: 'sph',
    },
    {
      title: 'HOS Rules',
      iconSrc: 'assets/svg/applicant/clock.svg',
      route: 'hos-rules',
    },
    {
      title: 'SSN Card',
      iconSrc: 'assets/svg/applicant/ssn.svg',
      route: 'ssn-card',
    },
    {
      title: 'CDL Card',
      iconSrc: 'assets/svg/applicant/card.svg',
      route: 'cdl-card',
    },
  ];

  public trackByIdentity = (index: number, item: any): number => index;

  constructor() {}

  ngOnInit(): void {
    const applicant = localStorage.getItem('applicant_user');

    if (applicant) {
      this.applicant = JSON.parse(applicant) as Applicant;
    }
  }
}
