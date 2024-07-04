import { Component, Input, OnInit } from '@angular/core';

// Models
import { CompanyUserChatResponsePaginationReduced } from '@pages/chat/models/company-user.model';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {

  //TODO change any type
  @Input() contact: CompanyUserChatResponsePaginationReduced;
  @Input() type: string;

  constructor() { }

  ngOnInit(): void { }

}
