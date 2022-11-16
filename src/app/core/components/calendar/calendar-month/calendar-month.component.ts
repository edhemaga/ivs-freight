import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-month',
  templateUrl: './calendar-month.component.html',
  styleUrls: ['./calendar-month.component.scss'],
})
export class CalendarMonthComponent implements OnInit {
  calendarMonth: any[] = [
    {
      month: 'JANUARY',
    },
    {
      month: 'FEBRUARY',
    },
    {
      month: 'MARCH',
    },
    {
      month: 'APRIL',
    },
    {
      month: 'MAY',
    },
    {
      month: 'JUNE',
    },
    {
      month: 'JULY',
    },
    {
      month: 'AUGUST',
    },
    {
      month: 'SEPTEMBER',
    },
    {
      month: 'OCTOBER',
    },
    {
      month: 'NOVEMBER',
    },
    {
      month: 'DECEMBER',
    },
  ];

  daysInWeek: any[] = [
    {
      day: 'S',
      weekendColor: '#B7B7B7',
    },
    {
      day: 'M',
    },
    {
      day: 'T',
    },
    {
      day: 'W',
    },
    {
      day: 'T',
    },
    {
      day: 'F',
    },
    {
      day: 'S',
      weekendColor: '#B7B7B7',
    },
  ];

  dateInMonth: any[] = [
    {
      date: 25,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 26,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 27,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 28,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 29,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 30,
      lastMonthDateColor: '#B7B7B7',
    },
    {
      date: 1,
      weekendDateColor: '#919191',
    },
    {
      date: 2,
      weekendDateColor: '#919191',
    },
    {
      date: 3,
    },
    {
      date: 4,
      event: true,
    },
    {
      date: 5,
    },
    {
      date: 6,
    },
    {
      date: 7,
      event: true,
    },
    {
      date: 8,
      weekendDateColor: '#919191',
    },
    {
      date: 9,
      weekendDateColor: '#919191',
    },
    {
      date: 10,
    },
    {
      date: 11,
    },
    {
      date: 12,
    },
    {
      date: 13,
    },
    {
      date: 14,
    },
    {
      date: 15,
      weekendDateColor: '#919191',
    },
    {
      date: 16,
      weekendDateColor: '#919191',
    },
    {
      date: 17,
    },
    {
      date: 18,
      event: true,
    },
    {
      date: 19,
      event: true,
    },
    {
      date: 20,
    },
    {
      date: 21,
    },
    {
      date: 22,
      weekendDateColor: '#919191',
    },
    {
      date: 23,
      weekendDateColor: '#919191',
    },
    {
      date: 24,
    },
    {
      date: 25,
    },
    {
      date: 26,
    },
    {
      date: 27,
      event: true,
    },
    {
      date: 28,
    },
    {
      date: 29,
      weekendDateColor: '#919191',
    },
    {
      date: 30,
      weekendDateColor: '#919191',
    },
    {
      date: 31,
    },
    {
      date: 1,
      nextMonthDateColor: '#B7B7B7',
    },
    {
      date: 2,
      nextMonthDateColor: '#B7B7B7',
    },
    {
      date: 3,
      nextMonthDateColor: '#B7B7B7',
    },
    {
      date: 4,
      nextMonthDateColor: '#B7B7B7',
    },
    {
      date: 5,
      nextMonthDateColor: '#B7B7B7',
    },
  ];

  colorDate: any;
  colorDay: any;

  constructor() {}

  ngOnInit(): void {
    this.calendarMonth.map((item, indx) => {
      item.monthDays = this.createCalendar(new Date(), indx);
      return item;
    });
  }

  openEvenPopover(t2, ev, indx, i) {
    console.log(indx, i);

    this.colorDate = indx;
    this.colorDay = i;

    if (t2.isOpen()) {
      t2.close();
      this.colorDate = -1;
      this.colorDay = -1;
    } else {
      console.log(ev);
      t2.open({ data: ev });
    }
  }

  createCalendar(dates, indx) {
    let dateInMonth: any[] = [];
    // Previous month
    const prevMonth = new Date(dates.getFullYear(), indx, 0);
    // This month
    const thisMonth = new Date(dates.getFullYear(), indx + 1, 0);
    // Next month
    const nextMonth = new Date(dates.getFullYear(), indx + 1, 1);

    // Last day of previous month
    const lastMonthDay = prevMonth.getDate();
    // Previos month last day name / 0 - 6 // 0 is Sunday
    const lastMonthDayName = prevMonth.getDay();

    const lastMonthDiff = lastMonthDay - lastMonthDayName;

    const thisMonthDays = thisMonth.getDate();

    const nextMonthDay = nextMonth.getDay();

    const currentDay = dates.getDate();
    const currMonth = dates.getMonth();

    if (lastMonthDayName !== 6) {
      for (let i = lastMonthDiff; i <= lastMonthDay; i++) {
        dateInMonth.push({
          date: i,
          lastMonthDateColor: '#B7B7B7',
        });
      }
    }

    for (let i = 1; i <= thisMonthDays; i++) {
      dateInMonth.push({
        date: i,
        current: currentDay == i && currMonth == indx,
      });
    }

    if (nextMonthDay != 0) {
      for (let i = 1; i <= 7 - nextMonthDay; i++) {
        dateInMonth.push({
          date: i,
          nextMonthDateColor: '#B7B7B7',
        });
      }
    }
    return dateInMonth;
  }
}
