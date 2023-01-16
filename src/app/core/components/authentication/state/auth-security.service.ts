import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthSecurityService {
    private accountActivatedSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(false);

    constructor() {}

    public updateAccountActivatedSubject(action: boolean) {
        this.accountActivatedSubject.next(action);
    }

    get getAccountActivatedSubject$() {
        return this.accountActivatedSubject.asObservable();
    }
}
