import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CardDetails } from '../../../core/components/shared/model/card-table-data.model';

@Injectable({
    providedIn: 'root',
})
export class TableCardDropdownActionsService {
    private openModal: Subject<{
        id: number;
        data: CardDetails;
        type: string;
    }> = new Subject<{
        id: number;
        data: CardDetails;
        type: string;
    }>();
    public openModal$: Observable<{
        id: number;
        data: CardDetails;
        type: string;
    }> = this.openModal.asObservable();

    public openDropdown(data: {
        id: number;
        data: CardDetails;
        type: string;
    }): void {
        this.openModal.next(data);
    }
}
