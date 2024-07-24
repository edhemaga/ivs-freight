import {
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  HostListener
} from '@angular/core';
import {
  ActivatedRoute,
} from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  Subject,
  takeUntil
} from 'rxjs';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/util/constants/chat-svg-routes.constants';
import { ChatPngRoutes } from '@pages/chat/util/constants/chat-png-routes.constants';

// Config
import { ChatInput } from '@pages/chat/util/config/chat-input.config';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import {
  CompanyUserShortResponse,
  ConversationResponse,
  MessageResponse
} from 'appcoretruckassist';
import { ChatAttachmentForThumbnail } from '@pages/chat/models/chat-attachment.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, OnDestroy {

  @ViewChild('messagesContent') messagesContent: ElementRef;

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') this.attachmentUploadActive = false;
  }

  private destroy$ = new Subject<void>();

  //User data
  public currentUserId: number = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')).companyUserId
    : 0;

  public remainingParticipants: CompanyUserShortResponse[];
  private conversation!: ConversationResponse;

  // Assets route
  public ChatSvgRoutes = ChatSvgRoutes;
  public ChatPngRoutes = ChatPngRoutes;

  // Messages
  public messageToSend: string = "";
  public messages: MessageResponse[] = [];
  private isMessageSendable: boolean = true;

  // Attachment upload
  public attachmentUploadActive: boolean = false;
  public attachments: ChatAttachmentForThumbnail[] = [];

  // Input toggle
  public isChatTypingActivated: boolean = false;
  public isChatTypingBlurred: boolean = false;

  // Form
  public messageForm!: UntypedFormGroup;

  // Config
  public ChatInput: ChatInput = ChatInput;

  constructor(
    // Ref
    private cdref: ChangeDetectorRef,

    //Router
    private activatedRoute: ActivatedRoute,

    // Form
    private formBuilder: UntypedFormBuilder,

    // Services
    private chatService: UserChatService,
    private chatHubService: HubService,
  ) { }

  ngOnInit(): void {
    this.creteForm();
    this.getResolvedData();
    this.connectToHub();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  private getResolvedData(): void {
    this.activatedRoute.data
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          this.messages = [...res.messages?.pagination?.data];

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

  public sendMessage(): void {

    if (!this.messageToSend || !this.conversation?.id || !this.isMessageSendable) return;

    this.isMessageSendable = false;

    this.chatService
      .sendMessage(
        this.conversation.id,
        this.messageToSend,
        this.attachments)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.messageToSend = "";
        this.isMessageSendable = true;
      });

  }

  private creteForm(): void {
    this.messageForm = this.formBuilder.group({
      message: [null]
    });
  }

  public enableChatInput(): void {
    this.isChatTypingActivated = true;
  }


  public uploadAttachmentDragAndDrop(): void {
    this.attachmentUploadActive = true;
  }

  public addAttachments(files: ChatAttachmentForThumbnail[]): void {
    this.attachments = [...this.attachments, ...files];
    this.attachmentUploadActive = false;

    this.enableChatInput();
  }

  public blurInput(): void {
    this.isChatTypingBlurred = false;
  }
  public focusInput(): void {
    this.isChatTypingBlurred = true;
  }

  // Trackers
  public trackById(index: number, item: MessageResponse): number {
    return item.id;
  }

  public trackByAttachmentName(index: number, attachment: ChatAttachmentForThumbnail): string {
    return attachment.name;
  }

  ngOnDestroy(): void {
    this.remainingParticipants = [];
    this.chatHubService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
