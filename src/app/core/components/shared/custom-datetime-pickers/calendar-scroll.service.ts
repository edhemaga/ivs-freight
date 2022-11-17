import { distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CalendarScrollService {
    public index$ = new Subject<any>();
    public indexAuto$ = new Subject<any>();
    public scrollToDate = new Subject<any>();
    public dateChanged = new Subject<any>();
    public selectedIndex = 0;
    scrolledIndexChange = this.index$.pipe(distinctUntilChanged());
    scrollToAutoIndex = this.indexAuto$.pipe(distinctUntilChanged());
    private scrolledScroll: string;

    constructor() {}

    public set setAutoIndex(number) {
        this.selectedIndex = number;
        this.indexAuto$.next(number);
    }

    public set scrolledScrollItem(name) {
        this.scrolledScroll = name;
    }

    public get selectedScroll() {
        return this.scrolledScroll;
    }
}
