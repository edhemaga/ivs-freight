import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class CommunicatorUserDataService {

  public userInfoBoxSubject = new BehaviorSubject<any>(0);

  public chatUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    const userString: string = localStorage.getItem('chatUser');
    let user: any = null;
    if (userString) {
      user = JSON.parse(userString);
    }
    this.chatUserSubject = new BehaviorSubject<any>(user);
  }

  get chatUser() {
    return this.chatUserSubject;
  }

}
