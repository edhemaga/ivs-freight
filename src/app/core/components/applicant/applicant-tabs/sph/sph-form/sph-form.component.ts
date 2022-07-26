import { Component, OnInit } from '@angular/core';

import { INavigation } from '../../../state/model/navigation.model';

@Component({
  selector: 'app-sph-form',
  templateUrl: './sph-form.component.html',
  styleUrls: ['./sph-form.component.scss'],
})
export class SphFormComponent implements OnInit {
  public menuItems: INavigation[] = [
    {
      title: 'Prospective employer',
      route: '1',
      class: 'bullet-1',
    },
    {
      title: 'Accident history',
      route: '2',
      class: 'bullet-2',
    },
    {
      title: 'Drug & alcohol history',
      route: '3',
      class: 'bullet-3',
    },
  ];

  storeArr = [
    { id: 1, isCompleted: false },
    { id: 2, isCompleted: false },
    { id: 3, isCompleted: false },
  ];
  constructor() {}

  ngOnInit(): void {}

  public trackByIdentity = (index: number, item: any): number => index;
}
