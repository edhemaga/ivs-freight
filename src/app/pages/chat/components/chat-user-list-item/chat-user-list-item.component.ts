import { Component, Input, OnInit } from '@angular/core';

// Models
import { CompanyUserChatResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-chat-user-list-item',
  templateUrl: './chat-user-list-item.component.html',
  styleUrls: ['./chat-user-list-item.component.scss']
})
export class ChatUserListItemComponent implements OnInit {

  @Input() contact: CompanyUserChatResponse;

  constructor() { }

  ngOnInit(): void {
    console.log(this.contact);
  }

}
