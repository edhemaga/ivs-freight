import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

// models
import {
    PasswordResponse,
    UpdateUserCommand,
    UserResponse,
    UserService,
    ValidatePasswordCommand,
    CheckUserByEmailResponse,
} from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class UserProfileUpdateService {
    private updateUserProfileSubject: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(false);

    constructor(private userService: UserService) {}

    public get updateUserProfile$() {
        return this.updateUserProfileSubject.asObservable();
    }

    public updateUserProfile(is: boolean) {
        this.updateUserProfileSubject.next(is);
    }

    public getUserById(id: number): Observable<UserResponse> {
        return this.userService.apiUserIdGet(id);
    }

    public updateUser(user: UpdateUserCommand): Observable<any> {
        return this.userService.apiUserPut(user);
    }

    public validateUserPassword(
        password: ValidatePasswordCommand
    ): Observable<PasswordResponse> {
        return this.userService.apiUserValidatepasswordPost(password);
    }

    public checkUserByEmail(
        email: string
    ): Observable<CheckUserByEmailResponse> {
        return this.userService.apiUserCheckEmailGet(email);
    }
}
