import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmationActivation } from '../models/confirmation-activation.model';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationActivationService {
    private confirmationActivationDataSubject: Subject<ConfirmationActivation> =
        new Subject<ConfirmationActivation>();

    public get getConfirmationActivationData$(): Observable<ConfirmationActivation> {
        return this.confirmationActivationDataSubject.asObservable();
    }

    public setConfirmationActivationData(data: ConfirmationActivation): void {
        this.confirmationActivationDataSubject.next(data);
    }
}
