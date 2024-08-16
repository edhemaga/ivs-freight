import { Component, Input, OnInit } from '@angular/core';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatMessageResponse } from '@pages/chat/models/chat-message-reponse.model';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

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

  public MethodsCalculationsHelper = MethodsCalculationsHelper;

  public singleImageAspectRation!: '3:2' | '2:3';

  constructor() { }

  ngOnInit(): void { }

}
