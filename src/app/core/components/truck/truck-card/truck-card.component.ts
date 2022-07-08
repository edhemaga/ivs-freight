import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-truck-card',
  templateUrl: './truck-card.component.html',
  styleUrls: ['./truck-card.component.scss'],
})
export class TruckCardComponent implements OnInit {
  truckCard: any[] = [
    {
      unit: '#31516',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'KENWORTH',
      model: 'FH540',
    },
    {
      unit: '#2365',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'MACK',
      model: 'Columbia GS',
    },
    {
      unit: '#76181',
      vin: 'GHLCTPOS110632183',
      year: 2011,
      make: 'MACK',
      model: 'D56-88S',
    },
    {
      unit: '#31516',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'KENWORTH',
      model: 'FH540',
    },
    {
      unit: '#2365',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'VOLVO',
      model: 'D56-88S',
      active: true,
    },
    {
      unit: '#76181',
      vin: 'GHLCTPOS110632183',
      year: 2011,
      make: 'MACK',
      model: 'D56-88S',
    },
    {
      unit: '#31516',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'KENWORTH',
      model: 'FH540',
    },
    {
      unit: '#2365',
      vin: 'GHLCTPOS110632183',
      year: 2012,
      make: 'VOLVO',
      model: 'D56-88S',
    },
    {
      unit: '#76181',
      vin: 'GHLCTPOS110632183',
      year: 2011,
      make: 'MACK',
      model: 'D56-88S',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  changeChatBox(e, indx) {
    this.truckCard[indx].checked = e.target.checked;
  }
}
