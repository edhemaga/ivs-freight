import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsSearchService {
    private closeSearchStatusSubject: BehaviorSubject<number> =
        new BehaviorSubject<number>(null);

    constructor() {}

    get getCloseSearchStatus$() {
        return this.closeSearchStatusSubject.asObservable();
    }

    public setCloseSearchStatus(detailsPartIndex: number) {
        this.closeSearchStatusSubject.next(detailsPartIndex);
    }
}
