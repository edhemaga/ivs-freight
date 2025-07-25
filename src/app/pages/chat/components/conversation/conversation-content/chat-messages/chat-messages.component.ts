import {
    OnDestroy,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    ViewChild,
    Input,
    Output,
    EventEmitter,
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
    ChatJoinedOrLeftMessageEnum,
    ChatMessageArrivalTypeEnum,
    ChatMessageTypeEnum,
    ChatStringTypeEnum,
    ChatTimeUnitEnum,
    ConversationTypeEnum,
} from '@pages/chat/enums';

// Helpers
import {
    chatMessageSenderFullname,
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';
import moment from 'moment';

// Constants
import { ChatDateOptionConstant } from '@pages/chat/utils/constants';

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

    @Output() public scrollTop: EventEmitter<void> = new EventEmitter();

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
    public messageOptionsSelected!: ChatMessage;
    public conversationTypeEnum = ConversationTypeEnum;
    public chatDateOptionConstant: string[] = ChatDateOptionConstant.options;

    // Form
    public messageForm!: UntypedFormGroup;

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
        this.messages$ = this.chatStoreService.selectMessages().pipe(
            map((arg) => {
                let count: number = 0;

                return {
                    ...arg,
                    data: [
                        ...arg?.data?.map((message, indx) => {
                            if (
                                message?.messageType?.name ===
                                    ChatMessageTypeEnum.JOINED_OR_LEFT &&
                                arg.data?.length !== indx
                            ) {
                                if (
                                    message.messageType.id ===
                                    arg.data[indx + 1]?.messageType?.id
                                )
                                    count++;
                                else {
                                    const modifiedMessage: ChatMessage = {
                                        ...message,
                                        content: `${
                                            message?.sender?.fullName
                                        } and ${count} others ${
                                            this.isJoined(message.content)
                                                ? ChatJoinedOrLeftMessageEnum.JOINED
                                                : ChatJoinedOrLeftMessageEnum.LEFT
                                        } channel.`,
                                    };
                                    count = 0;

                                    return modifiedMessage;
                                }
                            } else return { ...message };
                        }),
                    ],
                };
            })
        );
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

    public toggleDateSelection(message: ChatMessage): void {
        if (this.messageOptionsSelected) {
            this.messageOptionsSelected = null;
            return;
        }
        this.messageOptionsSelected = message;
    }

    public selectDateFilter(option: string): void {
        let dateFilter: string;

        switch (option) {
            case ChatMessageArrivalTypeEnum.TODAY:
                dateFilter = this.calculateDateOnDiff(0);
                break;
            case ChatMessageArrivalTypeEnum.YESTERDAY:
                dateFilter = this.calculateDateOnDiff(1);
                break;
            case ChatMessageArrivalTypeEnum.LAST_WEEK:
                dateFilter = this.calculateDateOnDiff(7);
                break;
            case ChatMessageArrivalTypeEnum.LAST_MONTH:
                dateFilter = this.calculateDateOnDiff(30);
                break;
            case ChatMessageArrivalTypeEnum.BEGINNING:
                dateFilter = moment(this.conversation?.createdAt).format(
                    ChatTimeUnitEnum.DAY_MONTH_YEAR
                );
                this.scrollTop.emit();
                break;
            default:
                break;
        }
    }

    // TODO maybe move to helpers if there is another use
    private calculateDateOnDiff(daysDiff: number): string {
        return moment()
            .subtract(daysDiff, ChatTimeUnitEnum.DAYS)
            .format(ChatTimeUnitEnum.DAY_MONTH_YEAR);
    }
    private isJoined(message: string): boolean {
        return message?.includes(ChatJoinedOrLeftMessageEnum.JOINED);
    }

    ngOnDestroy(): void {
        this.completeSubject();
    }
}
