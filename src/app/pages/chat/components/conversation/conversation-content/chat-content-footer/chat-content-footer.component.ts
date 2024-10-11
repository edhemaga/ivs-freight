import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
    BehaviorSubject,
    takeUntil,
    debounceTime,
    Observable,
    concatMap,
} from 'rxjs';

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
import moment from 'moment';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Enums
import { ChatAttachmentCustomClassEnum } from '@pages/chat/enums';

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
    @Input() public conversation!: ChatSelectedConversation;
    public conversationRemoveInDate!: string;
    public currentUserTyping!: Observable<string>;

    public replyMessage$!: Observable<ChatMessage | null>;
    public editMessage$!: Observable<ChatMessage | null>;
    // Form
    public messageForm!: UntypedFormGroup;

    // Messages
    private isMessageSendable: boolean = true;
    public currentMessage!: string;

    // Attachment upload
    public attachments$: Observable<UploadFile[]>;
    public attachments: UploadFile[];

    public hoveredAttachment!: ChatAttachmentForThumbnail;

    // Links
    public links: string[] = [];

    // Input toggle
    public isChatTypingActivated: boolean = true;
    public isChatTypingBlurred: boolean = false;

    // Mentions
    public isMentionActive: boolean = false;
    public mentionsList!: number[];

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
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForTyping();
        this.getDataFromStore();
        this.conversationRemoveInDate = moment(this.conversation?.updatedAt)
            .subtract(45, 'days')
            .format();
    }

    private getDataFromStore(): void {
        this.editMessage$ = this.chatStoreService.selectEditMessage();
        this.replyMessage$ = this.chatStoreService.selectReplyMessage();
        this.attachments$ = this.chatStoreService.selectAttachments();
        this.attachments$
            .pipe(takeUntil(this.destroy$))
            .subscribe((attachments: UploadFile[]) => {
                this.attachments = attachments;
            });
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

    public sendMessage = (parentMessageId?: number): void => {
        const message = this.messageForm?.value?.message;

        if (!this.conversation?.id || !this.isMessageSendable || !message)
            this.isMessageSendable = false;

        this.chatService
            .sendMessage(
                this.conversation.id,
                1,
                message,
                this.attachments,
                this.links,
                parentMessageId
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.isMessageSendable = true;
                this.chatStoreService.deleteAllAttachments();
                this.messageForm.reset();
                this.closeReplyAndEdit();
            });
    };

    public editMessage = (parentMessageId?: number): void => {
        const message = this.messageForm?.value?.message;
        const messageId: number = parentMessageId;

        if (!messageId || !message) return;

        this.chatService
            .editMessage(messageId, message)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.closeReplyAndEdit();
            });
    };

    private creteForm(): void {
        this.messageForm = this.formBuilder.group({
            message: [null],
        });
    }

    public enableChatInput(): void {
        this.isChatTypingActivated = true;
    }

    // TODO implement emoji selection
    public openEmojiSelection = (): void => {
        this.isEmojiSelectionActive = true;
    };

    public uploadAttachmentUpload = (): void => {
        this.chatStoreService.openAttachmentUpload();
    };

    public setHoveredAttachment(attachment: ChatAttachmentForThumbnail): void {
        this.hoveredAttachment = attachment;
    }

    public removeAttachment(attachment: UploadFile): void {
        this.chatStoreService.deleteAttachment(attachment);
    }

    public blurInput(): void {
        this.isChatTypingBlurred = false;
    }

    public focusInput(): void {
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
                    const messageSplitted: string[] = message.split(' ');
                    if (
                        messageSplitted[messageSplitted.length - 1].includes(
                            '@'
                        )
                    ) {
                        this.isMentionActive = true;
                    } else {
                        this.isMentionActive = false;
                    }
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

    public joinChannel(conversationId: number): void {
        if (!conversationId) return;
        this.chatService
            .joinChannel(conversationId)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }
}
