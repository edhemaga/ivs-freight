import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ReviewFeedbackService {
    private canConfirmAll = new BehaviorSubject<boolean>(true);
    public currentBtnAction = this.canConfirmAll.asObservable();

    private setAllConfirmed = new BehaviorSubject<boolean>(false);
    public currentSetAllConfirmed = this.setAllConfirmed.asObservable();

    constructor() {}

    public sendBtnAction(data: any) {
        this.canConfirmAll.next(data);
    }

    public setAllAsConfirmed(data: any) {
        this.setAllConfirmed.next(data);
    }
}
