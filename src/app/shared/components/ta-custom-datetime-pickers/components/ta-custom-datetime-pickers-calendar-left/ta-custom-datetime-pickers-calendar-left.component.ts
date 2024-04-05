import {
    Component,
    forwardRef,
    Input,
    OnChanges,
    OnInit,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

// services
import { CalendarDateTimePickerService } from '../../services/calendar-datetime-picker.service';

// modules
import {
    ScrollingModule,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';

// pipes
import { CalendarMonthsPipe } from 'src/app/shared/components/ta-custom-datetime-pickers/pipes/calendar-months.pipe';

// strategy
import {
    CalendarStrategy,
    STARTING_YEAR,
} from '../../calendar-strategy.ts/calendar_strategy';
// enums
import { CalendarLeftEnum } from 'src/app/core/utils/enums/datepicker-component.enum';

function factory(dir: TaCustomDateTimePickersCalendarLeftComponent) {
    return dir.scrollStrategy;
}

@Component({
    selector:
        'app-ta-custom-datetime-pickers-app-ta-custom-datetime-pickers-calendar-left',
    templateUrl: './ta-custom-datetime-pickers-calendar-left.component.html',
    styleUrls: ['./ta-custom-datetime-pickers-calendar-left.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, ScrollingModule, CalendarMonthsPipe],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: factory,
            deps: [
                forwardRef(() => TaCustomDateTimePickersCalendarLeftComponent),
            ],
        },
    ],
})
export class TaCustomDateTimePickersCalendarLeftComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() months: any;
    @Input() currentIndex: any;
    @Input() listPreview: any;
    @Input() isMonthAndYearOnly: boolean = false;

    public _currentYearIndex: number = 0;
    @Input() set currentYearIndex(value: number) {
        this._currentYearIndex = value;
        if (this.isMonthAndYearOnly && this._currentYearIndex)
            setTimeout(() => {
                this.scrollStrategy.scrollToIndex(
                    this._currentYearIndex,
                    'auto'
                );
            }, 200);
    }

    public _activeIndex: number = 0;
    @Input() set activeIndex(value: number) {
        this._activeIndex = value;
        if (!this.isMonthAndYearOnly && this._activeIndex)
            setTimeout(() => {
                this.scrollStrategy.scrollToIndex(this._activeIndex, 'auto');
            }, 200);
    }
    isHovered: boolean;
    private isFirstCall: boolean = true;

    private destroy$ = new Subject<void>();

    constructor(private calendarService: CalendarDateTimePickerService) {}

    scrollStrategy: CalendarStrategy = new CalendarStrategy(
        this.calendarService,
        CalendarLeftEnum.CYCLE_HEIGHT,
        CalendarLeftEnum.FULL_SIZE,
        'left'
    );

    ngOnChanges(change: any) {
        if (change.listPreview) {
            if (!change.listPreview.firstChange) {
                this.scrollStrategy.updateScrollHeights(
                    change.listPreview.currentValue === 'month_list'
                        ? CalendarLeftEnum.CYCLE_HEIGHT_BY_MONTHS
                        : CalendarLeftEnum.CYCLE_HEIGHT
                );
            }
        }
    }

    ngOnInit(): void {
        this.calendarService.scrollToAutoIndex
            .pipe(takeUntil(this.destroy$))
            .subscribe((indx) => {
                this.scrollStrategy.scrollToIndex(indx, 'auto');
            });

        this.calendarService.scrolledIndexChange
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (
                    res.type != 'left' &&
                    this.calendarService.selectedScroll != 'left'
                ) {
                    const sizeTimes =
                        CalendarLeftEnum.FULL_SIZE / res.cycleSize;
                    const newScrollSize = sizeTimes * res.scrollOffset;
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
                    } else
                        this.scrollStrategy.scrollToIndex(
                            this.currentIndex,
                            'auto'
                        );
                });
            });

        if (this.isMonthAndYearOnly) {
            setTimeout(() => {
                if (this.isFirstCall) {
                    this.scrollStrategy.updateScrollHeights(
                        CalendarLeftEnum.CYCLE_HEIGHT_BY_MONTHS
                    );

                    this.scrollStrategy.scrollToIndex(
                        this._currentYearIndex,
                        'auto'
                    );

                    this.isFirstCall = false;
                }
            }, 200);
        }
    }

    findIndexInMonth(date: string): number {
        const selectedDate = new Date(date);
        const indexMonth = (selectedDate.getFullYear() - STARTING_YEAR) * 12;
        const indx = indexMonth + selectedDate.getMonth();
        return indx;
    }

    public onScrollChanged(data): void {
        this.calendarService.index$.next(data);
    }

    public selectMonth(indx): void {
        this.scrollStrategy.scrollToIndex(indx, 'auto');
    }

    mouseOverSetItem() {
        this.calendarService.scrolledScrollItem = 'left';
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
