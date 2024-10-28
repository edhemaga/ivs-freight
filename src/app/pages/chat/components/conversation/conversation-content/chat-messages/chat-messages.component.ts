import {
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Observable, takeUntil, debounceTime, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Assets routes
import { ChatSvgRoutes, ChatPngRoutes } from '@pages/chat/utils/routes';

// Services
import {
    ChatHubService,
    UserProfileService,
    ChatStoreService,
} from '@pages/chat/services';

// Models
import {
    CompanyUserShortResponse,
    ConversationResponse,
} from 'appcoretruckassist';
import {
    ChatConversationMessageAction,
    ChatMessage,
    ChatMessageResponse,
} from '@pages/chat/models';

// Enums
import {
    ChatAttachmentCustomClassEnum,
    ChatMessageTypeEnum,
    ChatStringTypeEnum,
    ConversationTypeEnum,
} from '@pages/chat/enums';

// Helpers
import {
    chatMessageSenderFullname,
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-chat-messages',
    templateUrl: './chat-messages.component.html',
    styleUrls: ['./chat-messages.component.scss'],
})
export class ChatMessagesComponent
    extends UnsubscribeHelper
    implements OnInit, OnDestroy
{
    @ViewChild('messagesContent') messagesContent: ElementRef;
    @ViewChild('filesUpload', { static: false }) filesUpload!: ElementRef;

    @Input() public conversationParticipants!: CompanyUserShortResponse[];
    @Input() public conversation!: ConversationResponse;
    @Input() public wrapperHeightPx!: number;

    //User data
    public getCurrentUserHelper = GetCurrentUserHelper;

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;
    public chatPngRoutes = ChatPngRoutes;

    // Messages
    public messages$!: Observable<ChatMessageResponse>;
    public messages: ChatMessage[] = [];
    public messageIdActionsDisplayed!: number;
    public messageDateHovered!: ChatMessage;

    public conversationTypeEnum = ConversationTypeEnum;

    // Form
    public messageForm!: UntypedFormGroup;

    // Custom classes
    public ChatAttachmentCustomClassEnum = ChatAttachmentCustomClassEnum;

    constructor(
        // Ref
        private cdref: ChangeDetectorRef,

        // Router
        private activatedRoute: ActivatedRoute,

        // Services
        private chatHubService: ChatHubService,
        private chatStoreService: ChatStoreService,
        public userProfileService: UserProfileService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getResolvedData();
        this.connectToHub();
    }

    ngAfterContentChecked(): void {
        this.cdref.detectChanges();
    }

    private getResolvedData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.chatStoreService.setMessageResponse(res?.messages);
                this.conversation = res?.information;
                this.initStoreValues();
            });
    }

    public initStoreValues(): void {
        this.messages$ = this.chatStoreService.selectMessages();
    }

    private connectToHub(): void {
        ChatHubService.receiveMessage()
            .pipe(
                takeUntil(this.destroy$),
                map((message: ChatMessage) => {
                    const transformedMessage: ChatMessage =
                        chatMessageSenderFullname(this.messages, message);
                    return {
                        id: 0,
                        ...transformedMessage,
                        isReceivedFromHub: true,
                        messageType: message.messageType ?? {
                            name: ChatMessageTypeEnum.TEXT,
                            id: 1,
                        },
                        createdAt:
                            message?.createdAt ?? new Date().toISOString(),
                        fileCount:
                            transformedMessage.filesCount ??
                            transformedMessage.files?.length,
                        mediaCount:
                            transformedMessage.mediaCount ??
                            transformedMessage.media?.length,
                        linksCount:
                            transformedMessage.linksCount ??
                            transformedMessage.links?.length,
                    };
                })
            )
            .subscribe((message: ChatMessage) => {
                this.chatStoreService.addMessage(message);
            });

        this.chatHubService
            .receiveTypingNotification()
            .pipe(debounceTime(150), takeUntil(this.destroy$))
            .subscribe((companyUserId: number) => {
                const filteredUser: CompanyUserShortResponse =
                    this.conversationParticipants?.find(
                        (user) => user.id === companyUserId
                    );

                this.chatStoreService.setUserTyping(filteredUser?.fullName);
            })
            .add(() => {
                setTimeout(() => {
                    this.chatStoreService.setUserTyping(
                        ChatStringTypeEnum.EMPTY
                    );
                }, 1000);
            });
    }

    public handleMessageReplyOrEdit(data: ChatConversationMessageAction): void {
        this.messageIdActionsDisplayed = data.message?.id;
    }

    public hoverOverMessageDate(message: ChatMessage): void {
        if (message?.isReceivedFromHub) return;
        this.messageDateHovered = message;
    }

    ngOnDestroy(): void {
        this.chatHubService.disconnect();
        this.completeSubject();
    }
}
