import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'calendarmonths',
    standalone: true,
})
export class CalendarMonthsPipe implements PipeTransform {
    private MONTHS = [
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

    constructor() {}

    transform(index: Date, listPreview: string) {
        if (
            this.MONTHS[index.getMonth()] == 'January' ||
            listPreview == 'month_list'
        ) {
            return `<span class="left-year-show">${index.getFullYear()}</span>`;
        }
        return this.MONTHS[index.getMonth()].slice(0, 3);
    }
}
