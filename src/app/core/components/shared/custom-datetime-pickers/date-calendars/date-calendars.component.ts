import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, Subscription, takeUntil } from 'rxjs';

// moment
import moment from 'moment';

// services
import { CalendarScrollService } from './../calendar-scroll.service';

// constants
import { RANGE, STARTING_YEAR } from './calendar_strategy';

// components
import { CalendarDatesMainComponent } from '../calendar-dates-main/calendar-dates-main.component';
import { CalendarLeftComponent } from '../calendar-left/calendar-left.component';

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

@Component({
    selector: 'app-date-calendars',
    templateUrl: './date-calendars.component.html',
    styleUrls: ['./date-calendars.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        CalendarDatesMainComponent,
        CalendarLeftComponent,
    ],
})
export class DateCalendarsComponent implements OnInit, OnDestroy {
    @Input() listPreview: string;
    @Input() dateTime: any;
    @Input() isMonthAndYearOnly: boolean = false;
    @Output() setListPreviewValue = new EventEmitter();

    currentYear: any = new Date().getFullYear();
    currentMonth: any = new Date().getMonth();
    currentDay: any = new Date().getDate();
    activeIndex = 0;
    currentIndex: number;
    currentYearIndex: number;
    monthYearsIndx: any[] = [];
    months = Array.from({ length: RANGE }, (_, i) => {
        let year = STARTING_YEAR + Math.floor(i / 12);
        let month = i % 12;
        if (year == this.currentYear && month == this.currentMonth) {
            this.currentIndex = i;
            this.activeIndex = i;
        }
        const sendDate = new Date(year, month, 1);
        this.monthYearsIndx.push(moment(sendDate).format('MM/DD/YY'));
        return sendDate;
    });

    justYears = Array.from({ length: 100 }, (_, i) => {
        let year = STARTING_YEAR + i;
        if (year == this.currentYear) {
            this.currentYearIndex = i;
        }

        return new Date(STARTING_YEAR + i, 1, 1);
    });

    monthNames = [
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
    selectedYear: any;
    scrollTodayDate: boolean;
    selectedMonth: any;
    private activeMonth = 0;
    private subscription?: Subscription;
    private destroy$ = new Subject<void>();

    constructor(private calendarService: CalendarScrollService) {}

    ngOnInit(): void {
        this.selectedMonth = this.monthNames[this.dateTime.getMonth()];
        this.selectedYear = this.dateTime.getFullYear();

        if (this.calendarService.selectedIndex)
            this.activeIndex = this.calendarService.selectedIndex;

        this.calendarService.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.activeIndex = res.indx;
                this.onMonthChange(res.indx);
            });

        if (this.isMonthAndYearOnly)
            this.currentYearIndex = this.justYears.findIndex(
                (year) => year.getFullYear() === this.selectedYear
            );
    }

    onMonthChange(month: number) {
        if (this.listPreview == 'full_list') {
            this.selectedYear = this.months[month].getFullYear();
        } else {
            this.selectedYear = this.justYears[month].getFullYear();
        }

        this.selectedMonth = this.monthNames[this.months[month].getMonth()];
        this.activeMonth = month;
    }

    getMonth(index: number): string {
        return MONTHS[index];
    }

    public setListPreview(): void {
        if (this.listPreview === 'full_list') {
            this.setListPreviewValue.emit('month_list');
            this.calendarService.setAutoIndex = Math.floor(
                this.activeIndex / 12
            );
        }
    }

    public setListPreviewToFull(num) {
        this.setListPreviewValue.emit('full_list');
        this.setAutoIndex(num);
    }

    public setAutoIndex(num: number): void {
        this.calendarService.setAutoIndex = this.activeIndex * 12 + num;
    }

    public selectCurrentDay() {
        const new_date = moment(new Date()).format();
        this.calendarService.dateChanged.next(new_date);
        this.setListPreviewValue.emit('full_list');
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
