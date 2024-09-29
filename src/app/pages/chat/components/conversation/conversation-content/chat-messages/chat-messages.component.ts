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
    ViewChildren,
    Output,
    EventEmitter,
    Input,
} from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { BehaviorSubject, debounceTime, map, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Assets routes
import { ChatSvgRoutes, ChatPngRoutes } from '@pages/chat/utils/routes';

// Config
import { ChatInput, ChatDropzone } from '@pages/chat/utils/config';

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
import { ChatConversationMessageAction, ChatMessage } from '@pages/chat/models';

// Enums
import {
    ChatAttachmentHoveredClassStringEnum,
    ChatAttachmentCustomClassEnum,
} from '@pages/chat/enums';

// Helpers
import {
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

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') this.attachmentUploadActive = false;
    }

    @Input() public attachmentUploadActive: boolean = false;
    @Input() public isProfileDetailsDisplayed: boolean = false;
    @Input() public conversationParticipants!: CompanyUserShortResponse[];
    @Input() public conversation!: ConversationResponse;

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
    public messages: ChatMessage[] = [];
    public currentUserTypingName: BehaviorSubject<string | null> =
        new BehaviorSubject(null);

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
                this.messages = [...res?.messages?.pagination?.data];
                this.conversation = res?.information;
            });
    }

    public getMessages(): void {
        this.chatService
            .getMessages(this.conversation?.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.messages = [...res?.pagination?.data];
            });
    }

    private connectToHub(): void {
        ChatHubService.receiveMessage()
            .pipe(
                takeUntil(this.destroy$),
                map((arg) => {
                    return {
                        ...arg,
                        fileCount: arg.filesCount ?? arg.files?.length,
                        mediaCount: arg.mediaCount ?? arg.media?.length,
                        linksCount: arg.linksCount ?? arg.links?.length,
                    };
                })
            )
            .subscribe((message) => {
                if (message) {
                    this.messages = [...this.messages, message];
                }
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
        this.messageReplyOrEditEvent.emit(data);
    }

    ngOnDestroy(): void {
        this.chatHubService.disconnect();
        this.completeSubject();
    }
}
