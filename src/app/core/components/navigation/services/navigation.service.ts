import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private navigationDropdownActivationSubject: BehaviorSubject<{
        name: string;
        type: boolean;
    }> = new BehaviorSubject<{ name: string; type: boolean }>({
        name: null,
        type: false,
    });

    get navigationDropdownActivation$() {
        return this.navigationDropdownActivationSubject.asObservable();
    }

    public onDropdownActivation(data: { name: string; type: boolean }) {
        this.navigationDropdownActivationSubject.next(data);
    }
}
