import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  public inputDate: FormControl = new FormControl(true);


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
  ];

  monthDays: any = [
    {
      number: 25,
      prevOrNext: true,
      weekend: true
    },
    {
      number: 26,
      prevOrNext: true
    },
    {
      number: 27,
      prevOrNext: true
    },
    {
      number: 28,
      prevOrNext: true
    },
    {
      number: 29,
      prevOrNext: true
    },
    {
      number: 30,
      prevOrNext: true
    },
    {
      number: 1,
      weekend: true
    },
    {
      number: 2,
      weekend: true
    },
    {
      number: 3,
      currentDay: true
    },
    {
      number: 4
    },
    {
      number: 5
    },
    {
      number: 6
    },
    {
      number: 7
    },
    {
      number: 8,
      weekend: true
    },
    {
      number: 9,
      weekend: true
    },
    {
      number: 10
    },
    {
      number: 11
    },
    {
      number: 12
    },
    {
      number: 13
    },
    {
      number: 14
    },
    {
      number: 15,
      weekend: true
    },
    {
      number: 16,
      weekend: true
    },
    {
      number: 17
    },
    {
      number: 18
    },
    {
      number: 19
    },
    {
      number: 20
    },
    {
      number: 21
    },
    {
      number: 22,
      weekend: true
    },
    {
      number: 23,
      weekend: true
    },
    {
      number: 24
    },
    {
      number: 25
    },
    {
      number: 26
    },
    {
      number: 27
    },
    {
      number: 28
    },
    {
      number: 29,
      weekend: true
    },
    {
      number: 30,
      weekend: true
    },
    {
      number: 31,
      events: [
        {
          type: 'important',
          title: 'IFTA Report - Deadline',
          eventTextColor: '#fff'
        },
       {
          type: 'important',
          title: 'Important Events',
          eventTextColor: '#fff'
        },
        {
          type: 'company',
          title: 'Company Events',
          eventTextColor: '#fff'
        },
        {
          type: 'personal',
          title: 'Personal Events',
          eventTextColor: '#6C6C6C'
        },
        {
          type: 'moreEvents',
          title: '5 More Events',
          eventTextColor: '#fff'
        },
        {
          type: 'holiday',
          title: 'Holiday',
          eventTextColor: '#fff'
        }
      ]
    },
    {
      number: 1,
      prevOrNext: true,
    },
    {
      number: 2,
      prevOrNext: true,
    },
    {
      number: 3,
      prevOrNext: true,
    },
    {
      number: 4,
      prevOrNext: true,
    },
    {
      number: 5,
      prevOrNext: true,
      weekend: true
    }
  ]

  event_colors: any = {
    'important': '#BA68C8B3',
    'company': '#6D82C7B3',
    'personal': '#F3F3F3B3',
    'moreEvents': '#AAAAAAB3',
    'holiday': '#4DB6A2B3'
  }

  constructor() { }

  ngOnInit(): void {
  }

}
