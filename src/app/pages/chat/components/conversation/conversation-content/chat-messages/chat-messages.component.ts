import {
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
    HostListener,
    Output,
    EventEmitter,
    Input,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
    BehaviorSubject,
    debounceTime,
    map,
    Observable,
    takeUntil,
} from 'rxjs';
import { ActivatedRoute } from '@angular/router';
// Store

import { Store } from '@ngrx/store';

// Assets routes
import { ChatSvgRoutes, ChatPngRoutes } from '@pages/chat/utils/routes';

// Config
import { ChatDropzone } from '@pages/chat/utils/configs';

// Services
import {
    UserChatService,
    ChatHubService,
    UserProfileService,
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
import { ChatAttachmentCustomClassEnum } from '@pages/chat/enums';

// Helpers
import {
    chatMessageSenderFullname,
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';
import { addMessage, selectMessageResponse } from '@pages/chat/state';

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

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') this.isAttachmentUploadActive = false;
    }

    @Input() public isAttachmentUploadActive: boolean = false;
    @Input() public isProfileDetailsDisplayed: boolean = false;
    @Input() public conversationParticipants!: CompanyUserShortResponse[];
    @Input() public conversation!: ConversationResponse;
    @Input() public isReplyOrEditOpen: boolean = false;

    @Output() public userTypingEmitter: EventEmitter<number> =
        new EventEmitter();
    @Output()
    public messageReplyOrEditEvent: EventEmitter<ChatConversationMessageAction> =
        new EventEmitter();

    //User data
    public getCurrentUserHelper = GetCurrentUserHelper;

    // Assets route
    public ChatSvgRoutes = ChatSvgRoutes;
    public ChatPngRoutes = ChatPngRoutes;

    // Config
    public ChatDropzone = ChatDropzone;

    // Messages
    public messages$!: Observable<ChatMessageResponse>;
    public messages: ChatMessage[] = [];
    public currentUserTypingName: BehaviorSubject<string | null> =
        new BehaviorSubject(null);
    public messageIdActionsDisplayed!: number;

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
        private chatService: UserChatService,
        private chatHubService: ChatHubService,
        public userProfileService: UserProfileService,

        // Store
        private store: Store
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
        this.messages$ = this.store.select(selectMessageResponse).pipe(
            takeUntil(this.destroy$),
            map((res) => {
                return {
                    ...res,
                    data: res.data?.filter((message) => message.id !== 0),
                };
            })
        );

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.conversation = res?.information;
            });
    }

    private connectToHub(): void {
        ChatHubService.receiveMessage()
            .pipe(
                takeUntil(this.destroy$),
                map((message: ChatMessage) => {
                    const transformedMessage: ChatMessage =
                        chatMessageSenderFullname(this.messages, message);
                    return {
                        ...transformedMessage,
                        messageType: { name: 'Text', id: 1 },
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
                this.store.dispatch(addMessage(message));
            });

        this.chatHubService
            .receiveTypingNotification()
            .pipe(debounceTime(150), takeUntil(this.destroy$))
            .subscribe((companyUserId: number) => {
                const filteredUser: CompanyUserShortResponse =
                    this.conversationParticipants.find(
                        (user) => user.id === companyUserId
                    );
                this.currentUserTypingName.next(filteredUser?.fullName);
                this.userTypingEmitter.emit(companyUserId);

                setTimeout(() => {
                    this.currentUserTypingName.next(null);
                    this.userTypingEmitter.emit(0);
                }, 1000);
            });
    }

    public handleMessageReplyOrEdit(data: ChatConversationMessageAction): void {
        this.messageIdActionsDisplayed = data.message?.id;
        this.messageReplyOrEditEvent.emit(data);
    }

    ngOnDestroy(): void {
        this.chatHubService.disconnect();
        this.completeSubject();
    }
}
