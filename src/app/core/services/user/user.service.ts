import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {UserProfile} from "../../model/user-model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public newUser = new Subject();
  public editUser = new Subject();

  constructor(private http: HttpClient) {
  }

  get getNewUser() {
    return this.newUser;
  }

  get getEditUser() {
    return this.editUser;
  }

  public createUser(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/create', data);
  }

  public getUsersList() {
    return this.http.get(environment.API_ENDPOINT + 'company/user/list/1/' + environment.perPage);
  }

  public updateUser(id: any, data: any): Observable<UserProfile> {
    return this.http.put<UserProfile>(environment.API_ENDPOINT + `user/id/${id}`, data)
  }

  public getUserByUsername(username: string) {
    return this.http.get(environment.API_ENDPOINT + `user/username/${username}`);
  }

  public deleteUser(userId: number) {
    return this.http.delete(environment.API_ENDPOINT + `user/delete/${userId}`);
  }
}
