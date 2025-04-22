import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

export function onHTMLElementScroll(
    element: HTMLElement,
    threshold: number,
    callback: () => void
): void {
    const scrollOffset = element.scrollHeight - element.scrollTop;

    if (scrollOffset <= element.clientHeight + threshold) {
        callback();
    }
}

export function handleVirtualScrollTrigger(
    viewport: CdkVirtualScrollViewport,
    threshold: number,
    callback: () => void
): void {
    const scrollOffset = viewport.measureScrollOffset('bottom');
    if (scrollOffset < threshold) {
        callback();
    }
}
