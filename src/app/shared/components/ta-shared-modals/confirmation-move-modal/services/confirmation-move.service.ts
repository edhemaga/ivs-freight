import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Models
import { ConfirmationMove } from '@shared/components/ta-shared-modals/confirmation-move-modal/models/confirmation-move.model';

@Injectable({
    providedIn: 'root',
})
export class ConfirmationMoveService {
    private confirmationMoveDataSubject: Subject<ConfirmationMove> =
        new Subject<ConfirmationMove>();

    public get getConfirmationMoveData$(): Observable<ConfirmationMove> {
        return this.confirmationMoveDataSubject.asObservable();
    }

    public setConfirmationMoveData(data: ConfirmationMove): void {
        this.confirmationMoveDataSubject.next(data);
    }
}
