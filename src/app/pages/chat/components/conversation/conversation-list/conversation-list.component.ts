import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Config
import { ChatInput } from '@pages/chat/utils/config';

// Models
import {
    CompanyUserChatResponse,
    CompanyUserChatResponsePagination,
} from 'appcoretruckassist';

// Models
import {
    ChatCompanyChannelExtended,
    ChatGroupState,
    ChatMessageResponse,
} from '@pages/chat/models';

// Enums
import {
    ConversationTypeEnum,
    ChatGroupEnum,
    ChatGroupStateEnum,
    ChatObjectPropertyEnum,
    ChatSearchPlaceHolders,
} from '@pages/chat/enums';

// Animations
import { chatFadeVerticallyAnimation } from '@shared/animations/chat-fade-vertically.animation';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Services
import { ChatHubService } from '@pages/chat/services';
import { ChatConversationGroupStateConstant } from '@pages/chat/utils/constants';

@Component({
    selector: 'app-conversation-list',
    templateUrl: './conversation-list.component.html',
    styleUrls: ['./conversation-list.component.scss'],
    animations: [chatFadeVerticallyAnimation],
})
export class ConversationListComponent
    extends UnsubscribeHelper
    implements OnInit
{
    // Data
    @Input() public departments: ChatCompanyChannelExtended[];
    @Input() public truckChannel: ChatCompanyChannelExtended[];
    @Input() public dispatchBoardChannel: ChatCompanyChannelExtended[];
    @Input() public companyUsers: CompanyUserChatResponsePagination;
    @Input() public drivers: CompanyUserChatResponsePagination;

    // New message emitted from hub
    @Input() public newMessage: BehaviorSubject<ChatMessageResponse> =
        new BehaviorSubject(null);

    @Output() selectedConversation = new EventEmitter<{
        id: number[];
        type: ConversationTypeEnum;
        group: ChatGroupEnum;
    }>();

    public searchForm!: UntypedFormGroup;

    // Assets
    public ChatSvgRoutes = ChatSvgRoutes;
    //TODO create enum?
    public titleIcon: string;

    // Config
    public chatInput = ChatInput;
    public isAdvancedView: boolean = false;

    // Create list of states for all groups available
    public groupsState = ChatConversationGroupStateConstant.groupsState;

    // Enums
    public chatGroupStateEnum = ChatGroupStateEnum;
    public chatGroupEnum = ChatGroupEnum;
    public conversationTypeEnum = ConversationTypeEnum;
    private chatObjectPropertyEnum = ChatObjectPropertyEnum;
    public chatSearchPlaceholdersEnum = ChatSearchPlaceHolders;

    constructor(private formBuilder: UntypedFormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.initializeChatGroupStates();
        this.creteForm();
        this.listenForNewMessage();
    }

    private creteForm(): void {
        this.searchForm = this.formBuilder.group({
            searchTerm: [null],
        });
    }

    private listenForNewMessage(): void {
        ChatHubService.receiveMessage()
            .pipe(takeUntil(this.destroy$))
            .subscribe((msg) => {
                // TODO implement new logic
            });
    }

    private initializeChatGroupStates(): void {
        this.groupsState = [
            {
                ...this.findChatGroupState(ChatGroupEnum.Department),
                groupData: this.departments?.slice(0, 6),
            },
            {
                ...this.findChatGroupState(ChatGroupEnum.Truck),
                groupData: this.truckChannel?.slice(0, 6),
            },
            {
                ...this.findChatGroupState(ChatGroupEnum.Dispatch),
                groupData: this.dispatchBoardChannel?.slice(0, 6),
            },
            {
                ...this.findChatGroupState(ChatGroupEnum.CompanyUser),
                groupData: {
                    ...this.companyUsers,
                    data: this.companyUsers?.data?.slice(0, 6),
                    count: this.companyUsers?.data?.slice(0, 6).length,
                },
            },
            {
                ...this.findChatGroupState(ChatGroupEnum.Driver),
                groupData: {
                    ...this.drivers,
                    data: this.drivers?.data?.slice(0, 6),
                    count: this.drivers?.data?.slice(0, 6).length,
                },
            },
        ];
    }

    private showAllChatGroupData(
        group: ChatGroupState<
            ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination
        >
    ): ChatGroupState<
        ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination
    > {
        group.state = ChatGroupStateEnum.AllExpanded;

        switch (group.id) {
            case ChatGroupEnum.Department:
                this.departments = this.departments;
                break;
            case ChatGroupEnum.Truck:
                group.groupData = this.truckChannel;
                break;
            case ChatGroupEnum.Dispatch:
                group.groupData = this.dispatchBoardChannel;
                break;
            case ChatGroupEnum.CompanyUser:
                group.groupData = {
                    ...group.groupData,
                    data: this.companyUsers.data,
                    count: this.companyUsers.count,
                };
                break;
            case ChatGroupEnum.Driver:
                group.groupData = {
                    ...group.groupData,
                    data: this.drivers.data,
                    count: this.drivers.count,
                };
                break;
            default:
                return;
        }
        return group;
    }

    private findChatGroupState(
        groupId: ChatGroupEnum
    ): ChatGroupState<
        ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination
    > {
        return this.groupsState.find((group) => group.id === groupId);
    }

    // TODO implement new message notification
    private findChatGroupByParticipantId(
        id: number
    ): ChatGroupState<
        ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination
    > {
        return this.groupsState.find((group) => {});
    }

    public toggleChatGroupState(id: ChatGroupEnum, expandAll?: boolean): void {
        this.groupsState = this.groupsState.map((group) => {
            if (group.id !== id) return group;

            switch (true) {
                case expandAll && ChatGroupStateEnum.Collapsed === group.state:
                    group = this.showAllChatGroupData(group);
                    break;
                case ChatGroupStateEnum.Expanded === group.state ||
                    ChatGroupStateEnum.AllExpanded === group.state:
                    group.state = ChatGroupStateEnum.Collapsed;
                    break;
                case ChatGroupStateEnum.Collapsed === group.state:
                    this.initializeChatGroupStates();
                    group.state = ChatGroupStateEnum.Expanded;
                    break;
                default:
                    break;
            }

            return group;
        });
    }

    public selectConversation(
        item: ChatCompanyChannelExtended | CompanyUserChatResponse,
        type: ConversationTypeEnum,
        group: ChatGroupEnum
    ): void {
        if (this.chatObjectPropertyEnum.PARTICIPANTS in item) {
            this.selectedConversation.emit({
                id: [
                    ...item.participants.map((participant) => {
                        return participant.id;
                    }),
                ],
                type,
                group,
            });
            return;
        }

        if (this.chatObjectPropertyEnum.ID in item) {
            this.selectedConversation.emit({
                id: [item.id],
                type,
                group,
            });
            return;
        }
    }
}
