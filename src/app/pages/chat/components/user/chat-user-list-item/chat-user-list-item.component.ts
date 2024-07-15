import { Component, Input, OnInit } from '@angular/core';

// Models
import { CompanyUserChatResponse } from 'appcoretruckassist';

// Enums
import { ConversationStatus } from '@pages/chat/enums/conversation/conversation-status.enum';

@Component({
  selector: 'app-chat-user-list-item',
  templateUrl: './chat-user-list-item.component.html',
  styleUrls: ['./chat-user-list-item.component.scss']
})
export class ChatUserListItemComponent implements OnInit {

  @Input() contact: CompanyUserChatResponse;

  // TODO populate with hub response; waiting for BE implementation
  public ConversationStatus = ConversationStatus;
  public status: ConversationStatus = ConversationStatus.TYPING;

  constructor() { }

  ngOnInit(): void { }

}
