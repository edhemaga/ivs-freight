import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import {
    ChatConversationMessageAction,
    ChatMessage,
    ChatMessageResponse,
} from '@pages/chat/models';

// Enums
import {
    ChatImageAspectRatioEnum,
    ChatMessageActionEnum,
} from '@pages/chat/enums';

// Services
import { UserChatService } from '@pages/chat/services';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { takeUntil } from 'rxjs';

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
    @Input() isReplyOrEditOpen: boolean = false;

    @Output() messageDeletedEvent: EventEmitter<boolean> = new EventEmitter();

    @Output()
    messageActionReplyOrEdit: EventEmitter<ChatConversationMessageAction> =
        new EventEmitter();

    public messageReply: ChatMessage | null = null;
    public messageEdit: ChatMessage | null = null;
    public messageDeleted: boolean = false;

    // Helpers
    public MethodsCalculationsHelper = MethodsCalculationsHelper;

    // States
    public singleImageAspectRatio!: ChatImageAspectRatioEnum;
    public isFocused: boolean = false;
    public hasActionsDisplayed: boolean = false;

    // Message details and actions
    public messageDateAndTime!: string;
    public areActionsDisplayed: boolean = false;

    // Assets
    public chatSvgRoutes = ChatSvgRoutes;

    // Enums
    public chatMessageActionEnum = ChatMessageActionEnum;

    constructor(private chatService: UserChatService) {
        super();
    }

    ngOnInit(): void {
        this.checkImageDimensions(this.message.media[0]?.url);
        this.convertDate(this.message?.createdAt);
    }

    ngOnChanges(): void {
        this.hasActionsDisplayed = this.isReplyOrEditOpen;
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
        if (this.isReplyOrEditOpen && this.hasActionsDisplayed) {
            return;
        }
        this.hasActionsDisplayed = displayed;
    }

    public messageAction(actionType: ChatMessageActionEnum): void {
        switch (actionType) {
            case ChatMessageActionEnum.REPLY:
                this.messageEdit = null;
                this.messageReply = this.message;
                break;
            case ChatMessageActionEnum.EDIT:
                this.messageEdit = this.message;
                this.messageReply = null;
                break;
            case ChatMessageActionEnum.DELETE:
                this.chatService
                    .deleteMessage(this.message?.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.messageDeletedEvent.emit(true);
                    });
                return;
            default:
                return;
        }
        this.messageActionReplyOrEdit.emit({
            message: this.message,
            type: actionType,
        });
    }
}
