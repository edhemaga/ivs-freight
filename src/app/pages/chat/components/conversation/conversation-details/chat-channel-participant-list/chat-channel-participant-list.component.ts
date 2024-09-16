import { Component, Input, OnInit } from '@angular/core';

// Models
import { CompanyUserShortResponse } from 'appcoretruckassist';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

@Component({
  selector: 'app-chat-channel-participant-list',
  templateUrl: './chat-channel-participant-list.component.html',
  styleUrls: ['./chat-channel-participant-list.component.scss']
})
export class ChatChannelParticipantListComponent extends UnsubscribeHelper implements OnInit {

  @Input() public conversationParticipants!: CompanyUserShortResponse[];

  constructor() {
    super();
  }

  ngOnInit(): void { console.log(this.conversationParticipants); }
}
