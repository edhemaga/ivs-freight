import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    OnChanges,
    OnDestroy,
    forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// modules
import {
    ScrollingModule,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';

// moment
import moment from 'moment';

// services
import { CalendarScrollService } from './../calendar-scroll.service';

// components
import { CalendarDaysComponent } from '../calendar-days/calendar-days.component';

// strategy
import {
    CalendarStrategy,
    STARTING_YEAR,
} from './../date-calendars/calendar_strategy';

export const FULL_SIZE = 182;
// UKUPNA VISINA SCROLA 100 GODINA x ( 12 MESECI x PUNA VISINA JEDNO ITEMA U SCROLU )
export const CYCLE_HEIGHT = 100 * (12 * FULL_SIZE) + 50;

export const CYCLE_HEIGHT_BY_MONTHS = 100 * FULL_SIZE + 65;

function factory(dir: CalendarDatesMainComponent) {
    return dir.scrollStrategy;
}

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
    selector: 'app-calendar-dates-main',
    templateUrl: './calendar-dates-main.component.html',
    styleUrls: ['./calendar-dates-main.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ScrollingModule,
        CalendarDaysComponent,
    ],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: factory,
            deps: [forwardRef(() => CalendarDatesMainComponent)],
        },
    ],
})
export class CalendarDatesMainComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() months: any;
    @Input() dateTime: any;
    @Input() currentIndex: any;
    @Input() monthYearsIndx: any;
    @Input() listPreview: any;
    @Input() isMonthAndYearOnly: boolean = false;
    @Output() setListPreviewToFull: EventEmitter<Number> = new EventEmitter();
    @Output() setAutoIndex: EventEmitter<Number> = new EventEmitter();

    scrollStrategy: CalendarStrategy = new CalendarStrategy(
        this.calendarService,
        CYCLE_HEIGHT,
        FULL_SIZE,
        'main'
    );

    private destroy$ = new Subject<void>();

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
    selectedYearFromInput: any;
    selMonth: any;
    selectedMonth: any;
    private activeMonth = 0;

    constructor(private calendarService: CalendarScrollService) {}

    ngOnChanges(change: any) {
        if (change.listPreview) {
            if (!change.listPreview.firstChange) {
                this.scrollStrategy.updateScrollHeights(
                    change.listPreview.currentValue === 'month_list'
                        ? CYCLE_HEIGHT_BY_MONTHS
                        : CYCLE_HEIGHT
                );
            }
        }
    }

    ngOnInit(): void {
        this.selMonth = this.dateTime.getMonth();
        this.selectedYearFromInput = this.dateTime.getFullYear();
        //this.selectedYearFromInput = this.months.getFullYear();

        this.calendarService.scrollToAutoIndex
            .pipe(takeUntil(this.destroy$))
            .subscribe((indx) => {
                setTimeout(() => {
                    this.scrollStrategy.scrollToIndex(indx, 'auto');
                }, 0);
            });

        this.calendarService.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (
                    res.type != 'main' &&
                    this.calendarService.selectedScroll != 'main'
                ) {
                    const sizeTimes = FULL_SIZE / res.cycleSize;
                    const newScrollSize = Math.ceil(
                        sizeTimes * res.scrollOffset
                    );
                    this.scrollStrategy.scrollToOffset(newScrollSize, 'auto');
                }
            });

        this.calendarService.scrollToDate
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                setTimeout(() => {
                    if (res) {
                        const indx = this.findIndexInMonth(res);
                        this.scrollStrategy.scrollToIndex(indx, 'auto');
                    } else {
                        this.scrollStrategy.scrollToIndex(
                            this.currentIndex,
                            'auto'
                        );
                    }
                }, 200);
            });

        if (this.isMonthAndYearOnly) {
            setTimeout(() => {
                this.scrollStrategy.updateScrollHeights(CYCLE_HEIGHT_BY_MONTHS);
            }, 200);
        }
    }

    findIndexInMonth(date: string): number {
        const selectedDate = new Date(date);
        const indexMonth = (selectedDate.getFullYear() - STARTING_YEAR) * 12;
        const indx = indexMonth + selectedDate.getMonth();
        return indx;
    }

    onMonthChange(data: any) {
        if (this.months[data.indx]) {
            this.selectedYear = this.months[data.indx].getFullYear();
            this.selectedMonth =
                this.monthNames[this.months[data.indx].getMonth()];
            this.activeMonth = data.indx;
            this.calendarService.index$.next(data);
        }
    }

    getMonth(index: number): string {
        return MONTHS[index];
    }

    mouseOverSetItem() {
        this.calendarService.scrolledScrollItem = 'main';
    }

    public setCalendarListPreview(num, index): void {
        this.selMonth = num;

        if (this.isMonthAndYearOnly) {
            this.setAutoIndex.emit(num);
            
            const selectedMonth = this.months[index];
            const new_date = moment(
                new Date(selectedMonth.getFullYear(), num + 1, 0)
            ).format();
            this.calendarService.dateChanged.next(new_date);
        } else {
            this.setListPreviewToFull.emit(num);
        }
    }

    public selectDay(data): void {
        const selectedMonth = this.months[data.index];
        const new_date = moment(
            new Date(
                selectedMonth.getFullYear(),
                selectedMonth.getMonth(),
                data.day
            )
        ).format();
        this.calendarService.dateChanged.next(new_date);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
