import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationResetService {
    private confirmationResetDataSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    public get getConfirmationResetData$(): Observable<boolean> {
        return this.confirmationResetDataSubject.asObservable();
    }

    public setConfirmationResetData(isTableReset: boolean): void {
        this.confirmationResetDataSubject.next(isTableReset);
    }
}
