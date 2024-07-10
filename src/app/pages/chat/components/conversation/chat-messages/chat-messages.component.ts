import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import { CompanyUserShortResponse, ConversationResponse, MessageResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss']
})
export class ChatMessagesComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public currentUserId: number = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).companyUserId
    : 0;

  conversation!: ConversationResponse;
  remainingParticipants: CompanyUserShortResponse[];

  // Messages
  messageToSend: string = "";
  messages: MessageResponse[] = [];

  chatService = inject(UserChatService);
  chatHub = inject(HubService);

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (res) => {
        this.messages = res.messages;

        // Conversation participants
        this.conversation = res.information;
        this.remainingParticipants = this.conversation
          ?.participants
          .filter(participant => participant.id !== this.currentUserId);
      }
    });
    this.chatHub
      .connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.chatHub
            .receiveMessage()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (message) => {
                if (message) {
                  this.messages = [...this.messages, message];
                  this.messageToSend = "";
                }
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                console.log("Message received!")
              }
            });
        }
      });
  }

  getMessage(event): void {
    this.messageToSend = event.target.value;
  }

  sendMessage(): any {
    if (!this.conversation?.id || !this.messageToSend) return;
    this.chatService
      .sendMessage(this.conversation.id, this.messageToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageToSend = "";
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
