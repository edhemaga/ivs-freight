import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Models
import { ConversationResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit {
  title: string = "test";
  conversation!: ConversationResponse;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (res) => {
        this.conversation = res.conversationInformation;
      }
    })
  }

}
