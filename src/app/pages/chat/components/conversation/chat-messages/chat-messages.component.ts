import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Models
import { CompanyUserShortResponse, ConversationResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {

  public currentUserId: number = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).companyUserId
    : 0;

  public remainingParticipants: CompanyUserShortResponse[];
  private conversation!: ConversationResponse;

  public ChatSvgRoutes = ChatSvgRoutes;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getResolvedData();
  }

  private getResolvedData(): void {

    this.activatedRoute.data.subscribe(
      {
        next: (res) => {
          this.conversation = res.information;
          this.remainingParticipants = this.conversation
            ?.participants
            .filter(participant => participant.id !== this.currentUserId)
        }
      }
    );

  }

}
