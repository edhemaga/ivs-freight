import {CdkVirtualScrollViewport, VirtualScrollStrategy} from "@angular/cdk/scrolling";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {Injectable} from "@angular/core";
import { CalendarScrollService } from "../calendar-scroll.service";

// STARTING YEAR OF CALLENDAR, IT IS NOW YEAR MINUS 90 YEARS
export const STARTING_YEAR = new Date().getFullYear() - 90;
export const RANGE = 12; // 95 * 12

export const FULL_SIZE = 182;

const BUFFER = 500;
const CYCLE = getCycle();
export const CYCLE_HEIGHT = reduceCycle();

function getCycle(): ReadonlyArray<ReadonlyArray<number>> {
  return Array.from({length: 1}, (_, i) =>
    Array.from({length: 12}, (_, month) => FULL_SIZE)
  );
}

function reduceCycle(lastYear: number = 1, lastMonth: number = 12): number {
  return CYCLE.reduce(
    (total, year, yearIndex) =>
      yearIndex <= lastYear ? 
          total +
              year.reduce(
                (sum, month, monthIndex) =>
                  yearIndex < lastYear ||
                  (yearIndex === lastYear && monthIndex < lastMonth)
                    ? sum + month
                    : sum,
                0
              )
        : 
      total
    , 0);
}

/**
 * This scroll strategy is hard wired with styles for iOS and Android.
 * It is dependent on month height on those platforms and is designed to
 * work for {@link TuiMobileCalendarComponent} with years 1906 to 2102
 */
@Injectable()
export class MobileCalendarStrategy implements VirtualScrollStrategy {

  constructor(private calendarService: CalendarScrollService){

  }

  private index$ = new Subject<any>();
  scrolledIndexChange = this.index$.pipe(distinctUntilChanged());
  private viewport: CdkVirtualScrollViewport | null = null;

  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    console.log(CYCLE_HEIGHT);
    this.viewport.setTotalContentSize(CYCLE_HEIGHT);
    this.updateRenderedRange(this.viewport);
  }

  detach() {
    this.index$.complete();
    this.viewport = null;
  }

  onContentScrolled() {
    if (this.viewport) {
      this.updateRenderedRange(this.viewport);
    }
  }

  /** These do not matter for this case */
  onDataLengthChanged() {
  }

  onContentRendered() {
  }

  onRenderedOffsetChanged() {
  }

  scrollToIndex(index: number, behavior: ScrollBehavior) {
    if (this.viewport) {
      this.viewport.scrollToOffset(this.getOffsetForIndex(index), behavior);
    }
  }

  public getOffsetForIndex(index: number): number {
    return FULL_SIZE * index;
  }

  private getIndexForOffset(offset: number): number {
    return Math.round(offset / FULL_SIZE);
  }
  private updateRenderedRange(viewport: CdkVirtualScrollViewport) {
    // koliko je scrolovano
    const offset = viewport.measureScrollOffset();

    const {start, end} = viewport.getRenderedRange();
    const viewportSize = 230;

    const dataLength = viewport.getDataLength();
  
    const newRange = {start, end};
    const firstVisibleIndex = this.getIndexForOffset(offset);

    const startOffsetIndex = FULL_SIZE * start;
    console.log(start, end, dataLength);

    const startBuffer = offset - startOffsetIndex;
    console.log(offset, startOffsetIndex, startBuffer);
    if (startBuffer < BUFFER && start !== 0) {
      console.log("FIRST ONE");
      newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER * 2));
      newRange.end = Math.min(
        dataLength,
        this.getIndexForOffset(offset + viewportSize + BUFFER)
      );
    } else {
      console.log("SECOND ONE");
      const endBuffer = (FULL_SIZE * end) - offset - viewportSize;
      console.log("END BUFFER", endBuffer);
      console.log("WHAT IS END", end);
      console.log("DATA LENGTH",dataLength );
      if (endBuffer < BUFFER && end !== dataLength) {
        newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER));
        newRange.end = Math.min(
          dataLength,
          this.getIndexForOffset(offset + viewportSize + BUFFER * 2)
        );
      }
    }

    console.log(newRange);
    viewport.setRenderedRange(newRange);
    
    viewport.setRenderedContentOffset(this.getOffsetForIndex(newRange.start));
    if( this.calendarService.selectedScroll === 'main' ){
      this.index$.next({indx: firstVisibleIndex, scrollOffset: offset, cycleSize: FULL_SIZE, type: "main", offsetIndx: (offset / FULL_SIZE)});
    }
  }
}
