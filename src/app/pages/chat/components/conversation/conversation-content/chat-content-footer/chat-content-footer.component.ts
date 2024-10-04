import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    OnDestroy,
    ElementRef,
    Renderer2,
    ViewChildren,
    QueryList,
} from '@angular/core';
import {
    BehaviorSubject,
    takeUntil,
    debounceTime,
    Observable,
    concatMap,
} from 'rxjs';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Store
import { selectEditMessage, selectReplyMessage } from '@pages/chat/store';

// Models
import {
    ChatAttachmentForThumbnail,
    ChatMessage,
    ChatSelectedConversation,
} from '@pages/chat/models';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Services
import {
    ChatHubService,
    ChatStoreService,
    UserChatService,
} from '@pages/chat/services';

// Helpers
import { checkForLink, UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Enums
import {
    ChatAttachmentCustomClassEnum,
    ChatAttachmentHoveredClassStringEnum,
} from '@pages/chat/enums';

// Configs
import { ChatInput } from '@pages/chat/utils/configs';

@Component({
    selector: 'app-chat-content-footer',
    templateUrl: './chat-content-footer.component.html',
    styleUrls: ['./chat-content-footer.component.scss'],
})
export class ChatContentFooterComponent
    extends UnsubscribeHelper
    implements OnInit, OnDestroy
{
    @ViewChildren('documentPreview') documentPreview!: QueryList<ElementRef>;

    @Input() public conversation!: ChatSelectedConversation;
    @Input() currentUserTyping: BehaviorSubject<string | null> =
        new BehaviorSubject(null);

    @Output() closeReplyOrEditEvent: EventEmitter<boolean> = new EventEmitter();

    public replyMessage$!: Observable<ChatMessage | null>;
    public editMessage$!: Observable<ChatMessage | null>;
    // Form
    public messageForm!: UntypedFormGroup;

    // Messages
    private isMessageSendable: boolean = true;
    public currentMessage!: string;

    // Attachment upload
    public isAttachmentUploadActive: boolean = false;
    public attachments$: BehaviorSubject<UploadFile[]> = new BehaviorSubject(
        []
    );
    public hoveredAttachment!: ChatAttachmentForThumbnail;

    // Links
    public links: string[] = [];

    // Input toggle
    public isChatTypingActivated: boolean = true;
    public isChatTypingBlurred: boolean = false;

    // Emoji
    public isEmojiSelectionActive: boolean = false;

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    // Config
    public chatInput: ChatInput = ChatInput;

    // Custom classes
    public ChatAttachmentCustomClassEnum = ChatAttachmentCustomClassEnum;

    constructor(
        // Form
        private formBuilder: UntypedFormBuilder,

        // Services
        private chatService: UserChatService,
        private chatStoreService: ChatStoreService,

        // Renderer
        private renderer: Renderer2
    ) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForTyping();
        this.getReplyAndEditMessages();
    }

    private getReplyAndEditMessages(): void {
        this.editMessage$ = this.chatStoreService.selectEditMessage();
        this.replyMessage$ = this.chatStoreService.selectReplyMessage();
    }

    public handleSend(): void {
        const isComplete: BehaviorSubject<boolean> = new BehaviorSubject(false);

        this.editMessage$
            .pipe(
                concatMap((editMessage: ChatMessage) => {
                    if (editMessage) {
                        this.editMessage(editMessage.id);
                    }
                    return this.replyMessage$;
                }),
                takeUntil(this.destroy$ || isComplete)
            )
            .subscribe((replyMessage: ChatMessage) => {
                this.sendMessage(replyMessage?.id);
                isComplete.next(true);
                isComplete.complete();
            });
    }

    public sendMessage(parentMessageId?: number): void {
        const message = this.messageForm?.value?.message;

        if (!this.conversation?.id || !this.isMessageSendable) return;
        if (!message && !this.attachments$?.value?.length) return;

        this.isMessageSendable = false;

        this.chatService
            .sendMessage(
                this.conversation.id,
                1,
                message,
                this.attachments$.value,
                this.links,
                parentMessageId
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isMessageSendable = true;
                this.attachments$.next([]);
                this.messageForm.reset();
                this.closeReplyAndEdit();
            });
    }

    public editMessage(parentMessageId?: number): void {
        const message = this.messageForm?.value?.message;
        const messageId: number = parentMessageId;

        if (!messageId || !message) return;

        this.chatService
            .editMessage(messageId, message)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.closeReplyAndEdit();
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
        this.isAttachmentUploadActive = true;
    }

    public addAttachments(files: UploadFile[]): void {
        this.attachments$.next([...this.attachments$.value, ...files]);
        this.isAttachmentUploadActive = false;

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
                div.nativeElement.getAttribute('data-id') === String(index)
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
                if (message) {
                    ChatHubService.notifyTyping(this.conversation.id);
                    this.checkIfContainsLink(message);
                }
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

    public closeReplyAndEdit(): void {
        this.chatStoreService.resetReplyAndEditMessage();
    }
}
