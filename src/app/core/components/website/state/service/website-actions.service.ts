import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { UserInfoModel } from '../model/user-info.model';

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

    private registerUserInfoSubject: BehaviorSubject<UserInfoModel> =
        new BehaviorSubject<UserInfoModel>(null);

    private verifyUserInfoSubject: BehaviorSubject<UserInfoModel> =
        new BehaviorSubject<UserInfoModel>(null);

    private createPasswordSubject: BehaviorSubject<UserInfoModel> =
        new BehaviorSubject<UserInfoModel>(null);

    private isClickedSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
        null
    );

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

    get getVerifyUserInfoSubject$() {
        return this.verifyUserInfoSubject.asObservable();
    }

    get getCreatePasswordSubject$() {
        return this.createPasswordSubject.asObservable();
    }

    get getIsClickedSubject$() {
        return this.isClickedSubject.asObservable();
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

    public setRegisterUserInfoSubject(registerUserInfo: UserInfoModel) {
        this.registerUserInfoSubject.next(registerUserInfo);
    }

    public setVerifyUserInfoSubject(verifyUserInfo: UserInfoModel) {
        this.verifyUserInfoSubject.next(verifyUserInfo);
    }

    public setCreatePasswordSubject(userInfo: UserInfoModel) {
        this.createPasswordSubject.next(userInfo);
    }

    public setIsClickedSubject(value: any) {
        this.isClickedSubject.next(value);
    }
}
