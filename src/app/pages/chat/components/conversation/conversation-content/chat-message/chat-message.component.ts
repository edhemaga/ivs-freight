import { Component, Input, OnInit } from '@angular/core';
import { takeUntil, combineLatest } from 'rxjs';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatMessage } from '@pages/chat/models';

// Enums
import {
    ChatImageAspectRatioEnum,
    ChatMessageActionEnum,
} from '@pages/chat/enums';

// Services
import { ChatStoreService, UserChatService } from '@pages/chat/services';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
    selector: 'app-chat-message',
    templateUrl: './chat-message.component.html',
    styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent extends UnsubscribeHelper implements OnInit {
    @Input() currentUserId!: string;
    @Input() chatParticipants: CompanyUserShortResponse[];
    @Input() message!: ChatMessage;
    @Input() isDateDisplayed: boolean = false;

    public messageReply!: ChatMessage | null;
    public messageEdit!: ChatMessage | null;

    // Helpers
    public MethodsCalculationsHelper = MethodsCalculationsHelper;

    // States
    public singleImageAspectRatio!: ChatImageAspectRatioEnum;
    public isFocused: boolean = false;
    public hasActionsDisplayed: boolean = false;
    public selectedMessageId: number;

    // Message details and actions
    public messageDateAndTime!: string;
    public areActionsDisplayed: boolean = false;

    // Assets
    public chatSvgRoutes = ChatSvgRoutes;

    // Enums
    public chatMessageActionEnum = ChatMessageActionEnum;

    constructor(
        // Services
        private chatService: UserChatService,
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.checkImageDimensions(this.message.media[0]?.url);
        this.convertDate(this.message?.createdAt);
        this.getActiveReplyOrEdit();
    }

    private getActiveReplyOrEdit(): void {
        combineLatest([
            this.chatStoreService.selectActiveReplyOrEdit(),
            this.chatStoreService.selectReplyMessage(),
            this.chatStoreService.selectEditMessage(),
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([id, replyMessage, editMessage]) => {
                // Handle activeReplyOrEdit
                this.selectedMessageId = id;
                this.hasActionsDisplayed = !!id && this.message.id === id;
                this.isFocused = this.hasActionsDisplayed;

                // Handle selectReplyMessage
                this.messageReply = replyMessage;

                // Handle selectEditMessage
                this.messageEdit = editMessage;
            });
    }

    private checkImageDimensions(url: string): void {
        if (!url) return;

        const image = new Image();
        image.src = url;

        image.onload = () => {
            if (image.width > image.height) {
                this.singleImageAspectRatio =
                    ChatImageAspectRatioEnum.ThreeByTwo;
            } else {
                this.singleImageAspectRatio =
                    ChatImageAspectRatioEnum.TwoByThree;
            }
        };
    }

    private convertDate(date: string): void {
        if (!date) return;

        this.messageDateAndTime =
            MethodsCalculationsHelper.convertDateToTimeFromBackend(date, true);
    }

    public toggleActions(displayed: boolean): void {
        if (this.selectedMessageId === this.message.id) {
            return;
        }
        this.hasActionsDisplayed = displayed;
    }

    public messageAction(actionType: ChatMessageActionEnum): void {
        switch (actionType) {
            case ChatMessageActionEnum.REPLY:
                this.chatStoreService.resetReplyAndEditMessage();
                this.chatStoreService.replyMessage(this.message);
                break;
            case ChatMessageActionEnum.EDIT:
                this.chatStoreService.resetReplyAndEditMessage();
                this.chatStoreService.editMessage(this.message);
                break;
            case ChatMessageActionEnum.DELETE:
                this.chatService
                    .deleteMessage(this.message?.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.chatStoreService.deleteMessage(this.message);
                    });
                return;
            default:
                return;
        }
    }
}
