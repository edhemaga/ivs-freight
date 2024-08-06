import {
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  Renderer2,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  ActivatedRoute,
} from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
} from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  Subject,
  takeUntil
} from 'rxjs';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes/chat-svg-routes';
import { ChatPngRoutes } from '@pages/chat/utils/routes/chat-png-routes';

// Config
import { ChatInput } from '@pages/chat/utils/config/chat-input.config';
import { ChatDropzone } from '@pages/chat/utils/config/chat-dropzone.config';

// Services
import { UserChatService } from '@pages/chat/services/chat.service';
import { HubService } from '@pages/chat/services/hub.service';

// Models
import {
  CompanyUserShortResponse,
  ConversationInfoResponse,
  ConversationResponse,
  MessageResponse
} from 'appcoretruckassist';
import { ChatAttachmentForThumbnail } from '@pages/chat/models/chat-attachment.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Enums
import { AttachmentHoveredClassStringEnum } from '@pages/chat/enums/conversation/attachment-hovered-class-string.enum';
import { AttachmentCustomClassEnum } from '@pages/chat/enums/conversation/attachment-custom-classes.enum';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-chat-messages',
  templateUrl: './chat-messages.component.html',
  styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent implements OnInit, OnDestroy {

  @ViewChild('messagesContent') messagesContent: ElementRef;
  @ViewChildren('documentPreview') documentPreview!: QueryList<ElementRef>;

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
  public isProfileDetailsDisplayed: boolean = false;
  public userProfile!: ConversationInfoResponse;

  // Assets route
  public ChatSvgRoutes = ChatSvgRoutes;
  public ChatPngRoutes = ChatPngRoutes;

  // Config
  public ChatDropzone = ChatDropzone;

  // Messages
  public messages: MessageResponse[] = [];
  private isMessageSendable: boolean = true;
  public currentUserTypingName: BehaviorSubject<string | null> = new BehaviorSubject(null);

  // Emoji
  public isEmojiSelectionActive: boolean = false;

  // Attachment upload
  public attachmentUploadActive: boolean = false;
  public attachments: UploadFile[] = [];
  public hoveredAttachment!: ChatAttachmentForThumbnail;

  // Input toggle
  public isChatTypingActivated: boolean = false;
  public isChatTypingBlurred: boolean = false;

  // Form
  public messageForm!: UntypedFormGroup;

  // Config
  public ChatInput: ChatInput = ChatInput;

  // Custom classes
  public AttachmentHoveredClass = AttachmentHoveredClassStringEnum;
  public AttachmentCustomClassEnum = AttachmentCustomClassEnum;

  constructor(
    // Ref
    private cdref: ChangeDetectorRef,

    //Renderer
    private renderer: Renderer2,

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
      .subscribe(
        () => {
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

          this.chatHubService
            .receiveTypingNotification()
            .pipe(
              debounceTime(250),
              takeUntil(this.destroy$),
            )
            .subscribe((companyUserId: number) => {

              const filteredUser: CompanyUserShortResponse =
                this.remainingParticipants
                  .find(user =>
                    user.id === companyUserId
                  );
              this.currentUserTypingName.next(filteredUser?.fullName);

              setTimeout(() => {
                this.currentUserTypingName.next(null);
              }, 1000);

            })
        }
      );
  }

  public sendMessage(): void {
    const message = this.messageForm.value?.message;

    if (!message || !this.conversation?.id || !this.isMessageSendable) return;

    this.isMessageSendable = false;

    this.chatService
      .sendMessage(
        this.conversation.id,
        message,
        this.attachments)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(
        () => {
          this.isMessageSendable = true;
          this.attachments = [];
          this.messageForm.reset();
        }
      );
  }

  private creteForm(): void {
    this.messageForm = this.formBuilder.group({
      message: [null]
    });
  }

  public enableChatInput(): void {
    this.isChatTypingActivated = true;
  }

  public displayProfileDetails(value: boolean): void {

    if (this.isProfileDetailsDisplayed && !value) {
      this.isProfileDetailsDisplayed = value;
      return;
    }

    if (this.conversation?.id && value) {
      this.chatService
        .getAllConversationFiles(this.conversation.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: ConversationInfoResponse) => {
          this.isProfileDetailsDisplayed = value;
          this.userProfile = data;
        })
    }
  }

  // TODO implement emoji selection
  public openEmojiSelection(): void {
    this.isEmojiSelectionActive = true;
  }

  public uploadAttachmentDragAndDrop(): void {
    this.attachmentUploadActive = true;
  }

  public addAttachments(files: UploadFile[]): void {
    this.attachments = [...this.attachments, ...files];
    this.attachmentUploadActive = false;

    this.enableChatInput();
  }

  public setHoveredAttachment(attachment: ChatAttachmentForThumbnail): void {
    this.hoveredAttachment = attachment;
  }

  public clearHoveredAttachment(): void {
    this.documentPreview.forEach(
      (div: ElementRef) => {
        this.renderer.removeClass(div.nativeElement, AttachmentHoveredClassStringEnum.LIGHT),
          this.renderer.removeClass(div.nativeElement, AttachmentHoveredClassStringEnum.DARK);
      }
    );

    this.hoveredAttachment = null;
  }

  public handleHoveredAttachment(attachment: ChatAttachmentForThumbnail, index: number): string {

    const isSelectedAttachment: boolean = attachment === this.hoveredAttachment;

    const element = this.documentPreview.find(
      (div: ElementRef) =>
        div.nativeElement.getAttribute('data-id') == String(index)
    );
    if (element && isSelectedAttachment) {
      const classToAdd: string = this.isChatTypingBlurred ?
        AttachmentHoveredClassStringEnum.LIGHT :
        AttachmentHoveredClassStringEnum.DARK;
      this.renderer.addClass(element.nativeElement, classToAdd);
    }

    let icon: string;

    switch (true) {
      case this.isChatTypingBlurred && !isSelectedAttachment:
        icon = ChatSvgRoutes.darkXIcon;
        break;
      case this.isChatTypingBlurred && isSelectedAttachment:
        icon = ChatSvgRoutes.darkFocusedXIcon;
        break;
      case !this.isChatTypingBlurred && !isSelectedAttachment:
        icon = ChatSvgRoutes.lightXIcon;
        break;
      case !this.isChatTypingBlurred && isSelectedAttachment:
        icon = ChatSvgRoutes.lightFocusedXIcon;
        break;
      default:
        icon = '';
        this.clearHoveredAttachment();
        break;
    }

    return icon;

  }

  public removeAttachment(attachment: UploadFile): void {
    this.attachments = [...this.attachments.filter(arg => arg !== attachment)];
  }

  public blurInput(): void {
    this.isChatTypingBlurred = false;
    this.clearHoveredAttachment();
  }

  public focusInput(): void {
    this.clearHoveredAttachment();
    this.isChatTypingBlurred = true;
  }

  public notifyTyping(): void {

    this.messageForm.valueChanges
      .pipe(
        debounceTime(350),
        takeUntil(this.destroy$))
      .subscribe(arg => {
        if (arg.message) this.chatHubService.notifyTyping(this.conversation.id);
      })
  }

  ngOnDestroy(): void {
    this.chatHubService.disconnect();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
