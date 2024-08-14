import { Component, Input, OnInit } from '@angular/core';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatMessageResponse } from '@pages/chat/models/chat-message-reponse.model';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() currentUserId!: string;
  @Input() chatParticipants: CompanyUserShortResponse[];
  @Input() message!: ChatMessageResponse;
  @Input() isDateDisplayed: boolean = true;

  constructor() { }

  ngOnInit(): void { }

}
