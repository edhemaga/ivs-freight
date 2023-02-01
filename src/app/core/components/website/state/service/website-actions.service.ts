import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class WebsiteActionsService {
    private sidebarContentTypeSubject: BehaviorSubject<string | null> =
        new BehaviorSubject<string | null>(null);

    private sidebarContentWidthSubject: BehaviorSubject<number | null> =
        new BehaviorSubject<number | null>(null);

    private openSidebarSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    private resetPasswordTokenSubject: BehaviorSubject<string> =
        new BehaviorSubject<string>(null);

    private registerUserInfoSubject: BehaviorSubject<any> =
        new BehaviorSubject<any>(null);

    constructor() {}

    get getSidebarContentType$() {
        return this.sidebarContentTypeSubject.asObservable();
    }

    get getSidebarContentWidth$() {
        return this.sidebarContentWidthSubject.asObservable();
    }

    get getOpenSidebarSubject$() {
        return this.openSidebarSubject.asObservable();
    }

    get getResetPasswordToken$() {
        return this.resetPasswordTokenSubject.asObservable();
    }

    get getRegisterUserInfoSubject$() {
        return this.registerUserInfoSubject.asObservable();
    }

    public setSidebarContentType(type: string | null) {
        this.sidebarContentTypeSubject.next(type);
    }

    public setSidebarContentWidth(width: number | null) {
        this.sidebarContentWidthSubject.next(width);
    }

    public setOpenSidebarSubject(open: boolean) {
        this.openSidebarSubject.next(open);
    }

    public setResetPasswordToken(token: string) {
        this.resetPasswordTokenSubject.next(token);
    }

    public setRegisterUserInfoSubject(registerUserInfo: any) {
        this.registerUserInfoSubject.next(registerUserInfo);
    }
}
