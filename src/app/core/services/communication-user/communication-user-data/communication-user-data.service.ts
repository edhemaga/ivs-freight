import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CommunicationUserDataService {

  public userInfoBoxSubject = new BehaviorSubject<any>(0);

  public chatUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    // @ts-ignore
    const userString: string = localStorage.getItem('chatUser');
    let user: any = null;
    if (userString) {
      user = JSON.parse(userString);
    }
    this.chatUserSubject = new BehaviorSubject<any>(user);
  }

}
