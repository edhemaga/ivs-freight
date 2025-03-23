import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TableService {
    private tableWidthSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(0);

    constructor() {}

    get getTableWidth$() {
        return this.tableWidthSubject.asObservable();
    }

    public setTableWidth(width: number) {
        this.tableWidthSubject.next(width);
    }
}
