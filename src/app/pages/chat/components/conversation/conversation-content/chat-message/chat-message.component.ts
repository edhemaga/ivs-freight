import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
    deleteMessage,
    editMessage,
    replyMessage,
    resetReplyAndEditMessage,
} from '@pages/chat/state';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatConversationMessageAction, ChatMessage } from '@pages/chat/models';

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

    // @Output()
    // messageActionReplyOrEdit: EventEmitter<ChatConversationMessageAction> =
    //     new EventEmitter();

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

    constructor(
        private chatService: UserChatService,
        //Store
        private store: Store
    ) {
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
                this.store.dispatch(resetReplyAndEditMessage());

                this.store.dispatch(replyMessage(this.message));
                break;
            case ChatMessageActionEnum.EDIT:
                this.store.dispatch(resetReplyAndEditMessage());

                this.store.dispatch(editMessage(this.message));
                break;
            case ChatMessageActionEnum.DELETE:
                this.chatService
                    .deleteMessage(this.message?.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.store.dispatch(deleteMessage(this.message));
                    });
                return;
            default:
                return;
        }
    }
}
