import { Injectable } from '@angular/core';
import {CommunicatorUserDataService} from "./communicator-user-data.service";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorNotificationService {

  public user?: any;

  constructor(private communicatorUserDataService: CommunicatorUserDataService,
              //private notificationSocket: NotificationSocket
  ) {
    this.user = JSON.parse(localStorage.getItem('chatUser'));
    this.communicatorUserDataService.chatUser.subscribe((user?: any) => {
      this.user = user;
    });
  }

  trackUnreadSubscriptions = () => {
    if (this.user?.id) {
     // this.notificationSocket.emit('track-unread-subscriptions', this.user.id);
    }
  }

  untrackUnreadSubscriptions = () => {
    if (this.user?.id) {
     // this.notificationSocket.emit('untrack-unread-subscriptions', this.user.id);
    }

  }

  onUnreadSubscriptionCountChanged = () => {
   // return this.notificationSocket.fromEvent<any>('unread-subscription-count-changed');
  }

  resetUnreadMessages = (chatId: string) => {
    if (this.user) {
     // this.notificationSocket.emit('reset-unread-messages', chatId, this.user.id);
    }
  }

  trackResetUnreadMessages = () => {
    if (this.user?.id) {
     // this.notificationSocket.emit('track-reset-unread-messages', this.user.id);
    }
  }

  untrackResetUnreadMessages = () => {
    if (this.user?.id) {
     // this.notificationSocket.emit('untrack-reset-unread-messages', this.user.id);
    }
  }

  onSubscriptionReset = () => {
   // return this.notificationSocket.fromEvent<any>('subscription-reset');
  }

  onIncreaseCountOfUnread = () => {
    // return this.notificationSocket.fromEvent<{ chatId: string, type: string, userType: string }>('increased-count-of-unread');
  }

  onUnreadSubscriptionsChanged = () => {
   // return this.notificationSocket.fromEvent<number>('unread-subscriptions');
  }

  allowToastMessages = () => {
    if (this.user) {
      // this.notificationSocket.emit('allow-toast-messages', this.user.id);
    }
  }

  disallowToastMessages = () => {
    if (this.user) {
     // this.notificationSocket.emit('disallow-toast-messages', this.user.id);
    }
  }

  onToastReceived = () => {
    // return this.notificationSocket.fromEvent<{ type: string, data: any }>('toast');
  }

  trackHasUnreadSubscriptions = () => {
    if (this.user?.id) {
      // this.notificationSocket.emit('track-has-unread-subscriptions', this.user.id);
    }
  }

  untrackHasUnreadSubscriptions = () => {
    if (this.user?.id) {
     // this.notificationSocket.emit('untrack-has-unread-subscriptions', this.user.id);
    }
  }

  onHasUnreadSubscriptionsChanged = () => {
   // return this.notificationSocket.fromEvent<boolean>('has-unread');
  }
}
