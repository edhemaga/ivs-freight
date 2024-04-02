import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private navigationActive: BehaviorSubject<boolean>;
    private navigationHovered: BehaviorSubject<boolean>;
    private footerNavigationHover: BehaviorSubject<boolean>;

    constructor() {
        this.navigationActive = new BehaviorSubject<boolean>(true);
        this.navigationHovered = new BehaviorSubject<boolean>(false);
        this.footerNavigationHover = new BehaviorSubject<boolean>(false);
    }
    getValueWhichNavIsOpen(): Observable<boolean> {
        return this.navigationActive.asObservable();
    }
    setValueWhichNavIsOpen(newValue): void {
        this.navigationActive.next(newValue);
    }
    getValueNavHovered(): Observable<boolean> {
        return this.navigationHovered.asObservable();
    }
    setValueNavHovered(newValue): void {
        this.navigationHovered.next(newValue);
    }
    getValueFootHovered(): Observable<boolean> {
        return this.footerNavigationHover.asObservable();
    }
    setValueFootHovered(newValue): void {
        this.footerNavigationHover.next(newValue);
    }
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
