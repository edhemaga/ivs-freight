import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  public inputDate: FormControl = new FormControl();


  calendarYears: any[] = [
    {
      year: 2017
    },
    {
      year: 2018
    },
    {
      year: 2019
    },
    {
      year: 2020
    },
    {
      year: 2021
    },
    {
      year: 2022,
      active: true
    },
    {
      year: 2023
    },
    {
      year: 2024
    },
    {
      year: 2025
    },
    {
      year: 2026
    },
    {
      year: 2027
    },
    {
      year: 2028
    },
    {
      year: 2029
    },
    {
      year: 2030
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
