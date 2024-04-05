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
import { CalendarDateTimePickerService } from '../../services/calendar-datetime-picker.service';

// constants
import {
    RANGE,
    STARTING_YEAR,
} from '../../calendar-strategy.ts/calendar_strategy';

// components
import { TaCustomDateTimePickerCalendarDatesMainComponent } from '../ta-custom-datetime-pickers-calendar-dates-main/ta-custom-datetime-pickers-calendar-dates-main.component';
import { TaCustomDateTimePickersCalendarLeftComponent } from '../ta-custom-datetime-pickers-calendar-left/ta-custom-datetime-pickers-calendar-left.component';

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
    selector: 'app-ta-custom-datetime-pickers-date-calendars',
    templateUrl: './ta-custom-datetime-pickers-date-calendars.component.html',
    styleUrls: ['./ta-custom-datetime-pickers-date-calendars.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaCustomDateTimePickerCalendarDatesMainComponent,
        TaCustomDateTimePickersCalendarLeftComponent,
    ],
})
export class TaCustomDateTimePickersDateCalendarsComponent
    implements OnInit, OnDestroy
{
    @Input() listPreview: string;
    @Input() dateTime: Date;
    @Input() isMonthAndYearOnly: boolean = false;
    @Output() setListPreviewValue = new EventEmitter();

    private currentYear: number = new Date().getFullYear();
    private currentMonth: number = new Date().getMonth();
    private activeMonth = 0;
    private subscription?: Subscription;
    private destroy$ = new Subject<void>();
    private monthNames: string[] = [
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

    public activeIndex: number = 0;
    public currentIndex: number;
    public currentYearIndex: number;
    public monthYearsIndx: string[] = [];
    public months: Date[] = Array.from({ length: RANGE }, (_, i) => {
        const year = STARTING_YEAR + Math.floor(i / 12);
        const month = i % 12;
        if (year === this.currentYear && month === this.currentMonth) {
            this.currentIndex = i;
            this.activeIndex = i;
        }
        const sendDate = new Date(year, month, 1);
        this.monthYearsIndx.push(moment(sendDate).format('MM/DD/YY'));
        return sendDate;
    });

    public justYears: Date[] = Array.from({ length: 100 }, (_, i) => {
        const year = STARTING_YEAR + i;
        if (year === this.currentYear) this.currentYearIndex = i;

        return new Date(STARTING_YEAR + i, 1, 1);
    });

    public selectedYear: number;
    public selectedMonth: string;

    constructor(private calendarService: CalendarDateTimePickerService) {}

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
