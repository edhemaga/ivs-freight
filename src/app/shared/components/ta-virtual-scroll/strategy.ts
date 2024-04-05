import {
    CdkVirtualScrollViewport,
    VirtualScrollStrategy,
} from '@angular/cdk/scrolling';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';

export const STARTING_YEAR = new Date().getFullYear() - 90;

export const RANGE = 100 * 12;

const BUFFER = 500;

@Injectable()
export class ScrolllStrategy implements VirtualScrollStrategy {
    constructor(private startedHeight, private FULL_SIZE) {}

    private index$ = new Subject<any>();
    scrolledIndexChange = this.index$.pipe(distinctUntilChanged());
    private viewport: CdkVirtualScrollViewport | null = null;

    attach(viewport: CdkVirtualScrollViewport) {
        this.viewport = viewport;
        this.viewport.setTotalContentSize(this.startedHeight);
        this.updateRenderedRange(this.viewport);
    }

    updateScrollHeights(height: number) {
        this.viewport.setTotalContentSize(height);
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
    onDataLengthChanged() {}

    onContentRendered() {}

    onRenderedOffsetChanged() {}

    scrollToIndex(index: number, behavior: ScrollBehavior) {
        if (this.viewport) {
            this.viewport.scrollToOffset(
                this.getOffsetForIndex(index),
                behavior
            );
        }
    }

    scrollToOffset(offset: number, behavior: ScrollBehavior) {
        if (this.viewport) {
            this.viewport.scrollToOffset(offset, behavior);
        }
    }

    public getOffsetForIndex(index: number): number {
        return this.FULL_SIZE * index;
    }

    private getIndexForOffset(offset: number): number {
        return Math.round(offset / this.FULL_SIZE);
    }
    private updateRenderedRange(viewport: CdkVirtualScrollViewport) {
        const offset = viewport.measureScrollOffset();

        const { start, end } = viewport.getRenderedRange();
        const viewportSize = 230;

        const dataLength = viewport.getDataLength();

        const newRange = { start, end };

        const startOffsetIndex = this.FULL_SIZE * start;

        const startBuffer = offset - startOffsetIndex;
        if (startBuffer < BUFFER && start !== 0) {
            newRange.start = Math.max(
                0,
                this.getIndexForOffset(offset - BUFFER * 2)
            );
            newRange.end = Math.min(
                dataLength,
                this.getIndexForOffset(offset + viewportSize + BUFFER)
            );
        } else {
            const endBuffer = this.FULL_SIZE * end - offset - viewportSize;

            if (endBuffer < BUFFER && end !== dataLength) {
                newRange.start = Math.max(
                    0,
                    this.getIndexForOffset(offset - BUFFER)
                );
                newRange.end = Math.min(
                    dataLength,
                    this.getIndexForOffset(offset + viewportSize + BUFFER * 2)
                );
            }
        }

        viewport.setRenderedRange(newRange);
        viewport.setRenderedContentOffset(
            this.getOffsetForIndex(newRange.start)
        );
    }
}
