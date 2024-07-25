import { Component, Input, OnInit } from '@angular/core';

//Models
import { CompanyUserShortResponse, MessageResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() currentUserId!: string;
  @Input() chatParticipants: CompanyUserShortResponse[];
  @Input() message!: MessageResponse;
  @Input() showDate: boolean = true;

  constructor() { }

  ngOnInit(): void { }

}
