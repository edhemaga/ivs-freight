export interface ICustomScrollEvent {
    eventAction: 'scrolling' | 'isScrollShowing';
    isScrollBarShowing?: boolean;
    scrollPosition?: number;
}