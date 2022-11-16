import { CalendarScrollService } from './../calendar-scroll.service';
import {
    Component,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    CdkVirtualScrollViewport,
    VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { Subject, takeUntil } from 'rxjs';
import {
    CalendarStrategy,
    STARTING_YEAR,
} from '../date-calendars/calendar_strategy';

export const FULL_SIZE = 24;

export const CYCLE_HEIGHT = 100 * (12 * FULL_SIZE) + 265;

export const CYCLE_HEIGHT_BY_MONTHS = 100 * FULL_SIZE + 265;

function factory(dir: CalendarLeftComponent) {
    return dir.scrollStrategy;
}

@Component({
    selector: 'app-calendar-left',
    templateUrl: './calendar-left.component.html',
    styleUrls: ['./calendar-left.component.scss'],
    providers: [
        {
            provide: VIRTUAL_SCROLL_STRATEGY,
            useFactory: factory,
            deps: [forwardRef(() => CalendarLeftComponent)],
        },
    ],
})
export class CalendarLeftComponent implements OnInit, OnChanges {
    @Input() months: any;
    @Input() currentIndex: any;
    @Input() listPreview: any;
    isHovered: boolean;

    private destroy$ = new Subject<void>();

    constructor(private calendarService: CalendarScrollService) {}

    scrollStrategy: CalendarStrategy = new CalendarStrategy(
        this.calendarService,
        CYCLE_HEIGHT,
        FULL_SIZE,
        'left'
    );

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
                    const sizeTimes = FULL_SIZE / res.cycleSize;
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
