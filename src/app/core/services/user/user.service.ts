import {
  PasswordResponse,
  UpdateUserCommand,
  UserResponse,
  UserService,
  ValidatePasswordCommand,
} from 'appcoretruckassist';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaUserService {
  constructor(private userService: UserService) {}

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
}
