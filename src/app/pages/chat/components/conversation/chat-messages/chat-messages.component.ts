import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import { CompanyUserShortResponse, ConversationResponse, MessageResponse } from 'appcoretruckassist';

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

  public remainingParticipants: CompanyUserShortResponse[];
  private conversation!: ConversationResponse;

  // Icons
  public ChatSvgRoutes = ChatSvgRoutes;

  // Messages
  public messageToSend: string = "";
  public messages: MessageResponse[] = [];
  private canSendMessage: boolean = true;

  private chatService = inject(UserChatService);
  private chatHub = inject(HubService);

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getResolvedData();
    this.connectToHub();
  }

  // Get Data --------------------------------
  private getResolvedData(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messages = res.messages;

          // Conversation participants
          this.conversation = res.information;
          this.remainingParticipants = this.conversation
            ?.participants
            .filter(participant => participant.id !== this.currentUserId);
        }
      });
  }

  private connectToHub(): void {
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
  // -----------------------------------------

  // Messages --------------------------------
  public sendMessage(): void {

    // TODO create a helper function
    if (!this.canSendMessage || !this.conversation?.id || !this.messageToSend) return;

    this.chatService
      .sendMessage(this.conversation.id, this.messageToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageToSend = "";
          this.canSendMessage = true;
        }
      });
  }
  // ------------------------------------------

  ngOnDestroy(): void {
    this.remainingParticipants = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

}
