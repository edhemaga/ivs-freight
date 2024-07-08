import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user.model';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {

  @Input() contact: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void { }

  selectUser(userId: number) {
    this.selectedUser.emit(userId);
  }
}
