import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

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

  get chatUser() {
    return this.chatUserSubject;
  }

  requestChatUserData(companyId: number, userId: number) {
    return this.http.get(`${environment.baseChatApiUrl}/company/${companyId}/users/${userId}/company`)
      .pipe(map((res: any) => {
        if (res.status === 'success' && res.data) {
          localStorage.setItem('chatUser', JSON.stringify(res.data));
          this.chatUserSubject.next(res.data);
        }
        return res;
      }));
  }

  removeChatUserData() {
    localStorage.removeItem('chatUser');
    this.chatUserSubject.next(null);
  }

  changeChatUserData(chatUserData: any) {
    localStorage.setItem('chatUser', JSON.stringify(chatUserData));
    this.chatUserSubject.next(chatUserData);
  }

}
