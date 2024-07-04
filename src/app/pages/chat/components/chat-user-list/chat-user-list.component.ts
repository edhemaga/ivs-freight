import { Component, Input, OnInit } from '@angular/core';

// Models
import { CompanyUserChat } from '@pages/chat/models/company-user-chat.model';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.scss']
})
export class ChatUserListComponent implements OnInit {

  //TODO change any type
  @Input() data: CompanyUserChat[];
  @Input() type: string;

  constructor() { }

  ngOnInit(): void { }

}
