import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TaInputDropdownTableService {
    private dropdownOpenState = new BehaviorSubject<string>(null);

    public getDropdownCommentNewCommentState(): Observable<string> {
        return this.dropdownOpenState.asObservable();
    }

    public setDropdownCommentNewCommentState(dropdownId: string): void {
        this.dropdownOpenState.next(dropdownId);
    }
}
