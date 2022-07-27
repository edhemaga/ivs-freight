import { Component, OnInit } from '@angular/core';

import { INavigation } from 'src/app/core/components/applicant/state/model/navigation.model';
import { Applicant } from 'src/app/core/components/applicant/state/model/applicant.model';

@Component({
  selector: 'app-applicant-header',
  templateUrl: './applicant-header.component.html',
  styleUrls: ['./applicant-header.component.scss'],
})
export class ApplicantHeaderComponent implements OnInit {
  public menuItems: INavigation[] = [
    {
      title: 'Application',
      iconSrc: 'assets/svg/applicant/user.svg',
      route: '/application',
    },
    {
      title: 'Medical Cert.',
      iconSrc: 'assets/svg/applicant/medical.svg',
      route: '/medical-certificate',
    },
    {
      title: 'MVR Auth.',
      iconSrc: 'assets/svg/applicant/car.svg',
      route: '/mvr-authorization',
    },
    {
      title: 'PSP Auth.',
      iconSrc: 'assets/svg/applicant/case.svg',
      route: '/psp-authorization',
    },
    {
      title: 'SPH',
      iconSrc: 'assets/svg/applicant/shield.svg',
      route: '/sph',
    },
    {
      title: 'HOS Rules',
      iconSrc: 'assets/svg/applicant/clock.svg',
      route: '/hos-rules',
    },
    {
      title: 'SSN Card',
      iconSrc: 'assets/svg/applicant/ssn.svg',
      route: '/ssn-card',
    },
    {
      title: 'CDL Card',
      iconSrc: 'assets/svg/applicant/card.svg',
      route: '/cdl-card',
    },
  ];

  storeArr = [
    { id: 1, isCompleted: false },
    { id: 2, isCompleted: false },
    { id: 3, isCompleted: true },
    { id: 4, isCompleted: false },
    { id: 5, isCompleted: true },
    { id: 6, isCompleted: false },
    { id: 7, isCompleted: false },
    { id: 8, isCompleted: false },
  ];

  constructor() {}

  ngOnInit(): void {}

  public trackByIdentity = (index: number, item: any): number => index;
}
