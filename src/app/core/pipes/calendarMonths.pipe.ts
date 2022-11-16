import { Pipe, PipeTransform } from '@angular/core';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

@Pipe({
  name: 'calendarmonths',
})
export class CalendarMonthsPipe implements PipeTransform {
  constructor() {}

  transform(index: Date, listPreview: string) {
    if (MONTHS[index.getMonth()] == 'January' || listPreview == 'month_list') {
      return `<span class="left-year-show">${index.getFullYear()}</span>`;
    }
    return MONTHS[index.getMonth()].slice(0, 3);
  }
}
