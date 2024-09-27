import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

//Models
import { CompanyUserShortResponse } from 'appcoretruckassist';
import { ChatMessage, ChatMessageResponse } from '@pages/chat/models';

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

    @Output() messageReply: EventEmitter<ChatMessage> = new EventEmitter();

    @Output() messageEdit: EventEmitter<ChatMessage> = new EventEmitter();

    @Output() messageDeleted: EventEmitter<boolean> = new EventEmitter();

    public MethodsCalculationsHelper = MethodsCalculationsHelper;

    public singleImageAspectRatio!: ChatImageAspectRatioEnum;

    // Message details and actions
    public messageDateAndTime!: string;
    public areActionsDisplayed: boolean = false;

    // Assets
    public chatSvgRoutes = ChatSvgRoutes;

    // Enums
    public chatMessageActionEnum = ChatMessageActionEnum;

    public hasActionsDisplayed: boolean = false;

    constructor(private chatService: UserChatService) {
        super();
    }

    ngOnInit(): void {
        this.checkImageDimensions(this.message.media[0]?.url);
        this.convertDate(this.message?.createdAt);
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
        this.hasActionsDisplayed = displayed;
    }

    public messageAction(actionType: ChatMessageActionEnum): void {
        switch (actionType) {
            case ChatMessageActionEnum.REPLY:
                this.messageEdit.emit(null);
                this.messageReply.emit(this.message);
                break;
            case ChatMessageActionEnum.DELETE:
                this.chatService
                    .deleteMessage(this.message?.id)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe(() => {
                        this.messageDeleted.emit(true);
                    });
                break;
            case ChatMessageActionEnum.EDIT:
                this.messageReply.next(null);
                this.messageEdit.emit(this.message);
                break;
            default:
                return;
        }
    }
}
