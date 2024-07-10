import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// SVG routes
import { CompanyUserChatResponse } from 'appcoretruckassist';

// Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user-chat-response.model';
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {

  @Input() contact: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  @Output() selectedUser = new EventEmitter<number>();

  public ChatSvgRoutes = ChatSvgRoutes;

  constructor() { }

  ngOnInit(): void { }

  public selectUser(userId: number): void {
    this.selectedUser.emit(userId);
  }

  public trackById(index: number, chat: CompanyUserChatResponse): number {
    return chat.companyUser.id;
  }

}
