import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DetailsPageService {
    private DetailPageChangeSubject: Subject<number> = new Subject<number>();

    get pageDetailChangeId$() {
        return this.DetailPageChangeSubject.asObservable();
    }

    public getDataDetailId(id: number) {
        this.DetailPageChangeSubject.next(id);
    }

    constructor() {}
}
