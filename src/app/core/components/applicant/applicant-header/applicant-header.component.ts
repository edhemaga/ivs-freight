import { Component, OnInit } from '@angular/core';

import { INavigation } from 'src/app/core/components/applicant/state/model/navigation.model';
import { Applicant } from 'src/app/core/components/applicant/state/model/applicant.model';

@Component({
  selector: 'app-applicant-header',
  templateUrl: './applicant-header.component.html',
  styleUrls: ['./applicant-header.component.scss'],
})
export class ApplicantHeaderComponent implements OnInit {
  public applicant: Applicant;

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

  constructor() {}

  ngOnInit(): void {
    const applicant = localStorage.getItem('applicant_user');

    if (applicant) {
      this.applicant = JSON.parse(applicant) as Applicant;
    }
  }

  public trackByIdentity = (index: number, item: any): number => index;
}
