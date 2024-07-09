import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import { CompanyUserShortResponse, ConversationResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {

  public currentUserId: any = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).companyUserId
    : 0;

  conversation!: ConversationResponse;
  remainingParticipants: CompanyUserShortResponse[];

  chatHub = inject(HubService);

  constructor(private activatedRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (res) => {
        this.conversation = res.information;
        this.remainingParticipants = this.conversation
          ?.participants
          .filter(participant => participant.id !== this.currentUserId)
      }
    });
    this.chatHub.connect().subscribe((arg) => {
      console.log(arg);
    })
  }

}
