import {CdkVirtualScrollViewport, VirtualScrollStrategy} from "@angular/cdk/scrolling";
import {Subject} from "rxjs";
import {distinctUntilChanged} from "rxjs/operators";
import {Injectable} from "@angular/core";

export const STARTING_YEAR = 1905;
export const RANGE = 2352;

export const FULL_SIZE = 32;
const BUFFER = 800;
const CYCLE = getCycle();
export const CYCLE_HEIGHT = reduceCycle();

function getCycle(): ReadonlyArray<ReadonlyArray<number>> {
  return Array.from({length: 28}, (_, i) =>
    Array.from({length: 12}, (_, month) => FULL_SIZE)
  );
}

function reduceCycle(lastYear: number = 28, lastMonth: number = 12): number {
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
export class TableStrategy implements VirtualScrollStrategy {

  constructor(){

  }

  private index$ = new Subject<any>();
  scrolledIndexChange = this.index$.pipe(distinctUntilChanged());
  private viewport: CdkVirtualScrollViewport | null = null;

  attach(viewport: CdkVirtualScrollViewport) {
    this.viewport = viewport;
    this.viewport.setTotalContentSize(30 * 3000);
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
    const viewportSize = window.innerHeight;

    const dataLength = viewport.getDataLength();
  
    const newRange = {start, end};

    const startOffsetIndex = FULL_SIZE * start;

    const startBuffer = offset - startOffsetIndex;
    if (startBuffer < BUFFER && start !== 0) {
      newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER * 2));
      newRange.end = Math.min(
        dataLength,
        this.getIndexForOffset(offset + viewportSize + BUFFER)
      );
    } else {
      const endBuffer = (FULL_SIZE * end) - offset - viewportSize;
    
      if (endBuffer < BUFFER && end !== dataLength) {
        newRange.start = Math.max(0, this.getIndexForOffset(offset - BUFFER));
        newRange.end = Math.min(
          dataLength,
          this.getIndexForOffset(offset + viewportSize + BUFFER * 2)
        );
      }
    }

    viewport.setRenderedRange(newRange);
    viewport.setRenderedContentOffset(this.getOffsetForIndex(newRange.start));
  }
}
