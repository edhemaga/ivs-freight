import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// models
import { Confirmation } from './confirmation-modal.component';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationService {
    private confirmationDataSubject: Subject<Confirmation> =
        new Subject<Confirmation>();

    public get confirmationData$(): Observable<Confirmation> {
        return this.confirmationDataSubject.asObservable();
    }

    public sendConfirmationData(data: Confirmation): void {
        this.confirmationDataSubject.next(data);
    }
}
