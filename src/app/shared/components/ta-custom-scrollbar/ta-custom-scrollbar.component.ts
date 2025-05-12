import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { AfterViewInit, OnChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ObserversModule } from '@angular/cdk/observers';

import { Subject, takeUntil } from 'rxjs';

// services
import { SharedService } from '@shared/services/shared.service';
import { TruckassistTableService } from '@shared/services/truckassist-table.service';

// interfaces
import { ICustomScrollEvent } from '@shared/components/ta-custom-scrollbar/interfaces';

let hasTablePageHeight = false;
@Component({
    selector: 'app-ta-custom-scrollbar',
    templateUrl: './ta-custom-scrollbar.component.html',
    styleUrls: ['./ta-custom-scrollbar.component.scss'],
    standalone: true,
    imports: [FormsModule, CommonModule, ObserversModule],
})
export class TaCustomScrollbarComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
    @ViewChild('contentHolder', { static: false })
    private contentHolder: ElementRef;
    @ViewChild('bar', { static: false }) private bar: ElementRef;
    @ViewChild('scrollbarTrack', { static: false })
    private scrollbarTrack: ElementRef;
    @Output() scrollEvent: EventEmitter<ICustomScrollEvent> =
        new EventEmitter();
    @Input() scrollBarOptions: any;
    @Input() horizontalScrollHeight: number;
    @Input() isOverflowUnset?: boolean = false;

    scrollTop: number = 5;
    showScrollbar: boolean = false;
    scrollHeight: number = 0;
    scrollRatio: number = 0;
    scrollRatioFull: number = 0;
    showStickyHorizontalScrollbar: boolean = false;

    isMouseDown: boolean = false;
    startingBarOffsetTop: number = 0;
    barClickPosition: number = 0;
    barClickRestHeight: number = 0;
    private destroy$ = new Subject<void>();
    calculateSizeHeightTimer: any;

    // Table Horizontal Scroll
    tableNotPinedContainer: any;
    tableNotPinedBoundingRect: any;
    tableBarClickPosition: number = 0;
    tableBarClickRestWidth: number = 0;
    tableScrollRatio: number = 0;
    tableScrollRatioFull: number = 0;
    tableScrollWidth: number = 0;
    tableScrollbarTrackWidth: number = 0;

    constructor(
        private ngZone: NgZone,
        private elRef: ElementRef,
        private sharedService: SharedService,
        private chng: ChangeDetectorRef,
        private tableService: TruckassistTableService
    ) {}

    ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            document.addEventListener('mouseup', this.onMouseUpHandler);

            document.addEventListener('mousemove', this.onMouseMoveHandler);

            this.elRef.nativeElement.children[0].addEventListener(
                'scroll',
                this.setScrollEvent
            );

            window.addEventListener('resize', this.onResizeHandler);

            this.calculateBarSizeAndPosition(
                this.elRef.nativeElement.children[0]
            );
        });

        this.tableService.isScrollReseting
            .pipe(takeUntil(this.destroy$))
            .subscribe((response: boolean) => {
                if (response && this.bar?.nativeElement) {
                    this.bar.nativeElement.style.transform = `translateX(${0}px)`;
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            !changes?.horizontalScrollHeight?.firstChange &&
            changes?.horizontalScrollHeight
        ) {
            this.horizontalScrollHeight =
                changes.horizontalScrollHeight.currentValue;
        }

        if (
            !changes?.scrollBarOptions?.firstChange &&
            changes?.scrollBarOptions
        ) {
            this.scrollBarOptions = changes.scrollBarOptions.currentValue;
        }
    }

    ngAfterViewInit(): void {
        // Table Scroll
        if (this.scrollBarOptions.showHorizontalScrollBar) {
            setTimeout(() => {
                this.tableNotPinedContainer =
                    document.querySelector('.not-pined-columns');

                this.tableNotPinedBoundingRect =
                    this.tableNotPinedContainer?.getBoundingClientRect()
                        ? this.tableNotPinedContainer.getBoundingClientRect()
                        : null;
            }, 100);
        }
    }

    public setScrollEvent = (e: any) => {
        if (!this.isMouseDown) {
            this.calculateBarSizeAndPosition(
                this.elRef.nativeElement.children[0]
            );
        }
    };

    setDraggingStart(e: MouseEvent) {
        const style = window.getComputedStyle(this.bar.nativeElement);
        const matrix = new DOMMatrixReadOnly(style.transform);

        this.barClickPosition = e.clientY - matrix.m42;
        this.barClickRestHeight = this.scrollHeight - this.barClickPosition;
        this.isMouseDown = true;

        // Table Scroll
        this.tableBarClickPosition = e.clientX - matrix.m41;
        this.tableBarClickRestWidth =
            this.tableScrollWidth - this.tableBarClickPosition;
    }

    calculateBarSizeAndPosition(elem: any, pageHeight?: number) {
        setTimeout(() => {
            // Table Scroll
            if (this.scrollBarOptions.showHorizontalScrollBar) {
                const scrollWrapper =
                    document.querySelector('.not-pined-columns');

                this.tableNotPinedBoundingRect =
                    scrollWrapper?.getBoundingClientRect()
                        ? scrollWrapper.getBoundingClientRect()
                        : null;

                let scrollBarTrackWidth =
                    this.contentHolder.nativeElement.firstChild.clientWidth -
                    (this.tableNotPinedBoundingRect.left - 74);

                if (this.scrollBarOptions.hasShowMore)
                    scrollBarTrackWidth -= 93; // subtract Show More

                this.tableScrollbarTrackWidth = scrollBarTrackWidth;

                const tableFullWidth = scrollWrapper?.scrollWidth
                    ? scrollWrapper.scrollWidth
                    : 0;

                const tableVisibleWidth = scrollWrapper?.getBoundingClientRect()
                    .width
                    ? Math.ceil(scrollWrapper.getBoundingClientRect().width)
                    : 0;

                this.tableScrollRatio = tableVisibleWidth / tableFullWidth;

                this.tableScrollRatioFull = tableFullWidth / tableVisibleWidth;

                this.tableScrollWidth =
                    (scrollWrapper?.clientWidth / scrollWrapper?.scrollWidth) *
                    this.tableScrollbarTrackWidth;

                if (tableFullWidth <= tableVisibleWidth) {
                    this.showScrollbar = false;

                    this.chng.detectChanges();
                } else {
                    this.showScrollbar = true;
                    this.chng.detectChanges();
                }

                const content_height =
                    this.elRef.nativeElement.children[0].scrollHeight - 1;
                const visible_height = window.innerHeight;

                if (content_height >= visible_height - 60) {
                    this.showStickyHorizontalScrollbar = true;
                } else this.showStickyHorizontalScrollbar = false;

                this.scrollEvent.emit({
                    eventAction: 'isScrollShowing',
                    isScrollBarShowing: this.showScrollbar,
                });
            }
            // Regular Scroll
            else {
                const content_height =
                    this.elRef.nativeElement.children[0].scrollHeight - 1;
                const visible_height = window.innerHeight;

                if (content_height <= visible_height) {
                    this.showScrollbar = false;
                    this.chng.detectChanges();
                    return;
                } else {
                    this.showScrollbar = true;
                    this.chng.detectChanges();
                }

                this.scrollRatio = visible_height / content_height;
                this.scrollRatioFull = content_height / visible_height;
                this.scrollTop = elem.scrollTop * this.scrollRatio;

                if (this.bar) {
                    this.bar.nativeElement.style.transform = `translateY(${this.scrollTop}px)`;
                }

                this.scrollHeight = this.scrollRatio * visible_height;
            }

            this.chng.detectChanges();
        }, 100);
    }

    onMouseUpHandler = () => {
        this.isMouseDown = false;
    };

    resizeHandlerCount: any;
    onResizeHandler = () => {
        if (!this.isMouseDown && !hasTablePageHeight) {
            clearTimeout(this.resizeHandlerCount);
            this.resizeHandlerCount = setTimeout(() => {
                this.calculateBarSizeAndPosition(
                    this.elRef.nativeElement.children[0]
                );
            }, 150);
        }
    };

    onMouseMoveHandler = (e) => {
        if (this.isMouseDown) {
            // Regular Scroll
            if (this.scrollBarOptions.showVerticalScrollBar) {
                const offsetBar = e.clientY - this.barClickPosition;
                if (
                    offsetBar > -1 &&
                    e.clientY + this.barClickRestHeight < window.innerHeight
                ) {
                    this.bar.nativeElement.style.transform = `translateY(${offsetBar}px)`;
                }
                this.elRef.nativeElement.children[0].scrollTop =
                    (e.clientY - this.barClickPosition) * this.scrollRatioFull;

                if (hasTablePageHeight) {
                    this.sharedService.emitTableScrolling.emit(
                        (e.clientY - this.barClickPosition) *
                            this.scrollRatioFull
                    );
                }
            }
            // Table Scroll
            else {
                let offsetBar = e.clientX - this.tableBarClickPosition;

                const trackWidth =
                    this.scrollbarTrack.nativeElement.offsetWidth;
                const thumbWidth = this.bar.nativeElement.offsetWidth;
                const maxThumbOffset = trackWidth - thumbWidth;

                offsetBar = Math.max(0, Math.min(offsetBar, maxThumbOffset));

                this.bar.nativeElement.style.transform = `translateX(${offsetBar}px)`;

                const scrollWrapper =
                    document.querySelector('.not-pined-columns');

                const totalScrollableWidth =
                    scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
                const scrollLeft =
                    (offsetBar / maxThumbOffset) * totalScrollableWidth;

                this.scrollEvent.emit({
                    eventAction: 'scrolling',
                    scrollPosition: scrollLeft,
                });
            }
        }
    };

    ngOnDestroy(): void {
        document.removeEventListener('mouseup', this.onMouseUpHandler);
        document.removeEventListener('mousemove', this.onMouseMoveHandler);
        window.removeEventListener('resize', this.onResizeHandler);
        this.destroy$.next();
        this.destroy$.complete();
    }

    projectContentChanged(e) {
        clearTimeout(this.calculateSizeHeightTimer);
        this.calculateSizeHeightTimer = setTimeout(() => {
            this.calculateBarSizeAndPosition(
                this.elRef.nativeElement.children[0]
            );
        }, 100);
    }
}
