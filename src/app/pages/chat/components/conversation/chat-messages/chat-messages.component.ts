import {
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// Routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import {
  CompanyUserShortResponse,
  ConversationResponse,
  MessageResponse
} from 'appcoretruckassist';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private isMessageSendable: boolean = true;


  // Input toggle
  public isChatTypingActivated: boolean = false;

  // Form
  public messageForm!: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private chatService: UserChatService,
    private chatHubService: HubService,
  ) {
    this.creteForm();
  }

  ngOnInit(): void {
    this.getResolvedData();
    this.connectToHub();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  // Get Data 
  private getResolvedData(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.messages = [...res.messages];

          // Conversation participants
          this.conversation = res.information;
          this.remainingParticipants = this.conversation
            ?.participants
            .filter(participant => participant.id !== this.currentUserId);
        }
      );
  }

  private connectToHub(): void {
    this.chatHubService
      .connect()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.chatHubService
            .receiveMessage()
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              message => {
                if (message) {
                  this.messages = [...this.messages, message];
                }
              }
            );
        }
      });
  }
  // 

  // Messages 
  public sendMessage(): void {

    if (!this.messageToSend || !this.conversation?.id || !this.isMessageSendable) return;

    this.isMessageSendable = false;

    this.chatService
      .sendMessage(this.conversation.id, this.messageToSend)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.messageToSend = "";
        this.isMessageSendable = true;
      });

  }
  //

  // Util 
  private creteForm(): void {
    this.messageForm = this.formBuilder.group({
      message: null
    });
  }

  public enableChatInput(): void {
    this.isChatTypingActivated = true;
  }

  public trackById(index: number, item: MessageResponse): number {
    return item.id;
  }
  // 

  ngOnDestroy(): void {
    this.remainingParticipants = [];
    this.chatHubService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }

}
