import {Injectable} from '@angular/core';
import {CommunicatorUserDataService} from './communicator-user-data.service';
import {UserSocket} from "../../sockets/user-socket/user-socket.service";

@Injectable({providedIn: 'root'})

export class CommunicatorUserService {

  user?: any;

  constructor(private communicatorUserDataService: CommunicatorUserDataService, private userSocket: UserSocket) {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
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
