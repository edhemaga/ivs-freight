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
    ConversationInfoResponse,
    ConversationResponse,
} from 'appcoretruckassist';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import {
    ChatMessageResponse,
    ChatAttachmentForThumbnail,
} from '@pages/chat/models';

// Enums
import {
    ChatAttachmentHoveredClassStringEnum,
    ChatAttachmentCustomClassEnum,
} from '@pages/chat/enums';

// Helpers
import {
    checkForLink,
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
    @ViewChildren('documentPreview') documentPreview!: QueryList<ElementRef>;
    @ViewChild('filesUpload', { static: false }) filesUpload!: ElementRef;

    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape') this.attachmentUploadActive = false;
    }

    @Input() public attachmentUploadActive: boolean = false;
    @Input() public isProfileDetailsDisplayed: boolean = false;
    @Input() public conversationParticipants!: CompanyUserShortResponse[];

    @Output() userTypingEmitter: EventEmitter<number> = new EventEmitter();

    //User data
    public getCurrentUserHelper = GetCurrentUserHelper;

    private conversation!: ConversationResponse;

    // Assets route
    public ChatSvgRoutes = ChatSvgRoutes;
    public ChatPngRoutes = ChatPngRoutes;

    // Config
    public ChatDropzone = ChatDropzone;

    // Emoji
    public isEmojiSelectionActive: boolean = false;

    // Messages
    public messages: ChatMessageResponse[] = [];
    private isMessageSendable: boolean = true;
    public currentUserTypingName: BehaviorSubject<string | null> =
        new BehaviorSubject(null);
    public currentMessage!: string;

    // Attachment upload
    public attachments$: BehaviorSubject<UploadFile[]> = new BehaviorSubject(
        []
    );
    public hoveredAttachment!: ChatAttachmentForThumbnail;

    // Links
    public links: string[] = [];

    // Input toggle
    public isChatTypingActivated: boolean = false;
    public isChatTypingBlurred: boolean = false;

    // Form
    public messageForm!: UntypedFormGroup;

    // Config
    public ChatInput: ChatInput = ChatInput;

    // Custom classes
    public AttachmentHoveredClass = ChatAttachmentHoveredClassStringEnum;
    public ChatAttachmentCustomClassEnum = ChatAttachmentCustomClassEnum;

    constructor(
        // Ref
        private cdref: ChangeDetectorRef,

        //Renderer
        private renderer: Renderer2,
        private el: ElementRef,

        // Form
        private formBuilder: UntypedFormBuilder,

        // Services
        private chatService: UserChatService,
        private chatHubService: ChatHubService,
        public userProfileService: UserProfileService
    ) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.connectToHub();
        this.listenForTyping();
    }

    ngAfterContentChecked(): void {
        this.cdref.detectChanges();
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

    public sendMessage(): void {
        const message = this.messageForm.value?.message;

        if (!this.conversation?.id || !this.isMessageSendable) return;
        if (!message && !this.attachments$?.value?.length) return;

        this.isMessageSendable = false;

        this.chatService
            .sendMessage(
                this.conversation.id,
                message,
                this.attachments$.value,
                this.links
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isMessageSendable = true;
                this.attachments$.next([]);
                this.messageForm.reset();
            });
    }

    private creteForm(): void {
        this.messageForm = this.formBuilder.group({
            message: [null],
        });
    }

    public enableChatInput(): void {
        this.isChatTypingActivated = true;
    }

    // TODO implement emoji selection
    public openEmojiSelection(): void {
        this.isEmojiSelectionActive = true;
    }

    public uploadAttachmentDragAndDrop(): void {
        this.attachmentUploadActive = true;
    }

    public addAttachments(files: UploadFile[]): void {
        this.attachments$.next([...this.attachments$.value, ...files]);
        this.attachmentUploadActive = false;

        this.enableChatInput();
    }

    public setHoveredAttachment(attachment: ChatAttachmentForThumbnail): void {
        this.hoveredAttachment = attachment;
    }

    public clearHoveredAttachment(): void {
        this.documentPreview.forEach((div: ElementRef) => {
            this.renderer.removeClass(
                div.nativeElement,
                ChatAttachmentHoveredClassStringEnum.LIGHT
            ),
                this.renderer.removeClass(
                    div.nativeElement,
                    ChatAttachmentHoveredClassStringEnum.DARK
                );
        });

        this.hoveredAttachment = null;
    }

    public handleHoveredAttachment(
        attachment: ChatAttachmentForThumbnail,
        index: number
    ): string {
        const isSelectedAttachment: boolean =
            attachment === this.hoveredAttachment;

        const element = this.documentPreview.find(
            (div: ElementRef) =>
                div.nativeElement.getAttribute('data-id') == String(index)
        );
        if (element && isSelectedAttachment) {
            const classToAdd: string = this.isChatTypingBlurred
                ? ChatAttachmentHoveredClassStringEnum.LIGHT
                : ChatAttachmentHoveredClassStringEnum.DARK;
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
        const currentAttachments = this.attachments$.value.filter(
            (arg) => arg !== attachment
        );
        this.attachments$.next(currentAttachments);
    }

    public blurInput(): void {
        this.isChatTypingBlurred = false;
        this.clearHoveredAttachment();
    }

    public focusInput(): void {
        this.clearHoveredAttachment();
        this.isChatTypingBlurred = true;
    }

    public listenForTyping(): void {
        this.messageForm.valueChanges
            .pipe(debounceTime(150), takeUntil(this.destroy$))
            .subscribe((arg) => {
                const message: string = arg?.message;

                if (message)
                    this.chatHubService.notifyTyping(this.conversation.id);

                this.checkIfContainsLink(message);
            });
    }

    private checkIfContainsLink(message: string): void {
        if (!message) {
            this.links = [];
            return;
        }

        const wordsList: string[] = message.trim().split(' ');

        if (
            message.length < this.currentMessage?.length &&
            message !== this.currentMessage
        ) {
            this.links = [];

            wordsList.forEach((word) => {
                if (checkForLink(word)) this.links = [...this.links, word];
            });
        } else {
            if (
                //Shortest possible URL
                message.length < 3 ||
                // Check if last character is whitespace
                message[message.length - 1] === ' ' ||
                // Check if two consecutive characters are the same
                message[message.length - 2] === message[message.length - 1]
            )
                return;

            const lastTyped: string = wordsList.slice(-1)[0];

            if (lastTyped) {
                const isLink: boolean = checkForLink(lastTyped);
                if (isLink) this.links = [...this.links, lastTyped];
            }
        }
        this.currentMessage = message;
    }

    ngOnDestroy(): void {
        this.chatHubService.disconnect();
        this.completeSubject();
    }
}
