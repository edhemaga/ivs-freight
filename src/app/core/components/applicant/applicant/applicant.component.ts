import { Component, OnInit } from '@angular/core';

import { INavigation } from '../state/model/navigation.model';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.scss'],
})
export class ApplicantComponent implements OnInit {
  public menuItems: INavigation[] = [
    {
      title: 'Personal Info',
      route: '1',
      class: 'bullet-1',
    },
    {
      title: 'Work experience',
      route: '2',
      class: 'bullet-2',
    },
    {
      title: 'CDL Information',
      route: '3',
      class: 'bullet-3',
    },
    {
      title: 'Accident records',
      route: '4',
      class: 'bullet-4',
    },
    {
      title: 'Traffic violations',
      route: '5',
      class: 'bullet-5',
    },
    {
      title: 'Education',
      route: '6',
      class: 'bullet-6',
    },
    {
      title: '7 Days HOS',
      route: '7',
      class: 'bullet-7',
    },
    {
      title: 'Drug & Alchocol statement',
      route: '8',
      class: 'bullet-8',
    },
    {
      title: 'Driver rights',
      route: '9',
      class: 'bullet-9',
    },
    {
      title: 'Disclosure & release',
      route: '10',
      class: 'bullet-10',
    },
    {
      title: 'Authorization',
      route: '11',
      class: 'bullet-11',
    },
  ];

  public trackByIdentity = (index: number, item: any): number => index;

  constructor() {}

  ngOnInit(): void {}
}
