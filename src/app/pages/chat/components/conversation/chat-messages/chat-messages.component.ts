import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  @ViewChild('messagesContent') messagesContent: ElementRef;

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


  // Input toggle
  public isChatTypingActivated: boolean = false;

  // Services
  private chatService = inject(UserChatService);
  private chatHub = inject(HubService);

  // Form
  public messageForm!: FormGroup;
  constructor(private activatedRoute: ActivatedRoute) {
    this.initForm();
  }

  ngOnInit(): void {

    this.getResolvedData();

    this.connectToHub();

    this.scrollToBottom();

  }

  // Get Data --------------------------------
  private getResolvedData(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messages = res.messages;
          this.scrollToBottom(32);

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
                  this.scrollToBottom(32);
                }
              },
              error: (err) => {
                console.error(err)
              },
              complete: () => {
                this.scrollToBottom(32);
                console.log("Message received!")
              }
            });
        }
      });
  }
  // -----------------------------------------

  // Messages --------------------------------
  public sendMessage(): void {

    if (!this.messageToSend || !this.conversation?.id || !this.canSendMessage) return;

    this.canSendMessage = false;

    this.chatService
      .sendMessage(this.conversation.id, this.messageToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.messageToSend = "";
          this.canSendMessage = true;
          this.scrollToBottom(32);
        }
      });

  }
  // ------------------------------------------


  // Util -------------------------------------
  private initForm(): void {
    this.messageForm = new FormGroup({
      message: new FormControl()
    });
  }

  public enableChatInput(): void {
    this.isChatTypingActivated = true;
  }

  private scrollToBottom(additionalScrollInPixel?: number): void {
    if (!this.messagesContent?.nativeElement) return;

    const container = this.messagesContent.nativeElement;
    container.scrollTop = 99999 + additionalScrollInPixel ?? 0;
  }

  public trackById(index: number, item: MessageResponse): number {
    return item.id;
  }
  // ------------------------------------------


  ngOnDestroy(): void {
    this.remainingParticipants = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

}
