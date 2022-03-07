import {Injectable} from '@angular/core';
import {UserSocket} from "../../sockets/user-socket/user-socket.service";
import {CommunicationUserDataService} from "./communication-user-data/communication-user-data.service";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorUserService {

  user?: any;

  constructor(
    private communicatorUserDataService: CommunicationUserDataService,
    private userSocket: UserSocket
  ) {
  }

  trackUserStatuses() {
    if (this.user) {
      this.userSocket.emit('track-user-statuses', this.user.id, this.user.companyId);
    }
  }

  leaveUserStatuses() {
    if (this.user) {
      this.userSocket.emit('leave-user-statuses', this.user.id, this.user.companyId);
    }
  }

  changeMyStatus(status: string) {
    if (this.user) {
      /* if (status !== 'offline') {
        this.communicatorUserDataService.changeChatUserData({
          ...this.user,
          status
        });
      } */
      this.userSocket.emit('change-my-status', this.user.id, status);
    }
  }

  onChangeMyStatus() {
    return this.userSocket.fromEvent<string>('my-status-changed');
  }

  onUserStatusChanged() {
    return this.userSocket.fromEvent<{ id: string, status: string, chats: any[] }>('user-status-changed');
  }

}
