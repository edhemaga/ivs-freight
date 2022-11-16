import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Confirmation } from './confirmation-modal.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationService {
    private confirmationDataSubject: Subject<Confirmation> =
        new Subject<Confirmation>();

    public get confirmationData$() {
        return this.confirmationDataSubject.asObservable();
    }

    public sendConfirmationData(data: Confirmation) {
        this.confirmationDataSubject.next(data);
    }

    constructor() {}
}
