import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, takeUntil } from 'rxjs';

// Models
import {
    CompanyUserChatResponse,
    ConversationInfoResponse,
    EnumValue,
} from 'appcoretruckassist';
import {
    ChatResolvedData,
    CompanyUserChatResponsePaginationReduced,
    ChatTab,
    ChatCompanyChannelExtended,
    ChatSelectedConversation,
    ChatPreferenceItem,
    ChatConversationDetails,
} from '@pages/chat/models';

// Enums
import {
    ChatConversationProfileDetailsType,
    ChatGridLayout,
    ChatGroupEnum,
    ChatRoutesEnum,
    ChatStringTypeEnum,
    ChatToolbarActiveFilterEnum,
    ChatViewTypeEnum,
    ConversationTypeEnum,
    ChatAttachmentCustomClassEnum,
    ChatObjectPropertyEnum,
} from '@pages/chat/enums';

// Constants
import {
    ChatToolbarDataConstant,
    ChatPreferencesConfig,
} from '@pages/chat/utils/constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Service
import {
    ChatStoreService,
    UserChatService,
    UserProfileService,
} from '@pages/chat/services';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers/unsubscribe-helper';

// Animations
import {
    chatFadeHorizontallyAnimation,
    chatFadeVerticallyAnimation,
} from '@shared/animations';
import { ChatCount } from '@pages/chat/utils/helpers';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    animations: [chatFadeHorizontallyAnimation, chatFadeVerticallyAnimation],
})
export class ChatComponent
    extends UnsubscribeHelper
    implements OnInit, OnDestroy
{
    public title!: string;

    // Data
    public departments!: ChatCompanyChannelExtended[];
    public companyChannels: ChatCompanyChannelExtended[];
    public companyUsers!: CompanyUserChatResponsePaginationReduced;
    public drivers!: CompanyUserChatResponsePaginationReduced;
    public archivedCompanyUsers!: CompanyUserChatResponsePaginationReduced;
    public archivedDrivers!: CompanyUserChatResponsePaginationReduced;

    public unreadCount!: number;
    public favoriteCount!: number;
    public selectedConversation: number;
    public conversation$!: Observable<ChatSelectedConversation>;
    public conversation: ChatSelectedConversation;

    public ConversationTypeEnum = ConversationTypeEnum;

    // User Profile Data
    public isProfileDetailsDisplayed$!: Observable<boolean>;
    public isParticipantsDisplayed$!: Observable<boolean>;

    public conversationProfileDetails$!: Observable<ChatConversationDetails>;

    public isAttachmentUploadActive$: Observable<boolean>;
    public isHamburgerMenuActive: boolean = false;

    // Tab and header ribbon configuration
    public tabs: ChatTab[] = ChatToolbarDataConstant.tabs;
    public chatPreferencesConfig: ChatPreferenceItem[] =
        ChatPreferencesConfig.items;
    public chatToolbarActiveFilterEnum = ChatToolbarActiveFilterEnum;
    public activeFilter: ChatToolbarActiveFilterEnum;

    // Assets and enums
    public chatSvgRoutes = ChatSvgRoutes;
    public chatGridLayout = ChatGridLayout;
    public chatConversationProfileDetailsType =
        ChatConversationProfileDetailsType;
    public chatAttachmentCustomClassEnum = ChatAttachmentCustomClassEnum;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,

        // Services
        private chatService: UserChatService,
        public userProfileService: UserProfileService,
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getDataOnLoad();
        this.selectStoreData();
    }

    private getResolvedData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ChatResolvedData) => {
                this.chatStoreService.closeAllProfileInformation();

                this.title = res.title;
                this.drivers = res.drivers;
                this.companyUsers = res.users;
                this.departments = res.departments;
                this.chatStoreService.addDepartments(this.departments);
                this.tabs[0].count =
                    this.drivers.count +
                    this.companyUsers.count +
                    this.departments.length;

                const unreadCount = ChatCount.getTotalCount<
                    CompanyUserChatResponse[]
                >(
                    ChatObjectPropertyEnum.HAS_UNREAD_MESSAGES,
                    this.companyUsers.data,
                    this.drivers.data
                );
                // TODO move this to effect
                this.chatStoreService.setUnreadCount(unreadCount);
                this.chatStoreService
                    .selectUnreadCount()
                    .subscribe((count: number) => {
                        this.unreadCount = count;
                    });
                const favoriteCount = ChatCount.getTotalCount<
                    CompanyUserChatResponse[]
                >(
                    ChatObjectPropertyEnum.IS_FAVORITE,
                    this.companyUsers.data,
                    this.drivers.data
                );
                this.chatStoreService.setFavoriteCount(favoriteCount);
                this.chatStoreService
                    .selectFavoriteCount()
                    .subscribe((count: number) => {
                        this.favoriteCount = count;
                    });
            });
    }

    private selectStoreData(): void {
        this.conversation$ = this.chatStoreService.selectConversation();
        this.isProfileDetailsDisplayed$ =
            this.chatStoreService.selectIsProfileDetailsDisplayed();
        this.conversationProfileDetails$ =
            this.chatStoreService.selectConversationProfileDetails();
        this.isParticipantsDisplayed$ =
            this.chatStoreService.selectIsConversationParticipantsDisplayed();
        this.isAttachmentUploadActive$ =
            this.chatStoreService.selectAttachmentUploadStatus();

        this.conversation$
            .pipe(takeUntil(this.destroy$))
            .subscribe((conversation) => {
                this.conversation = conversation;
                this.chatStoreService.closeAttachmentUpload();
            });
    }

    private getDataOnLoad(): void {
        this.getResolvedData();

        const urlTree = this.router.parseUrl(this.router.url);
        // Get route parameters
        const segments = urlTree.root.children['primary'].segments;
        if (segments.length > 1) {
            this.selectedConversation = Number(segments[2].path) ?? 0;
        }
    }

    public onSelectTab(item: ChatTab): void {
        this.tabs.forEach((arg) => {
            arg.checked = arg.name === item.name;
        });
    }

    public createUserConversation(
        participantsId: number[],
        conversationType: ConversationTypeEnum,
        group: ChatGroupEnum,
        name: string,
        channelType?: EnumValue
    ): void {
        if (!participantsId?.length) return;

        this.chatService
            .createConversation(participantsId, conversationType)
            .pipe(takeUntil(this.destroy$))
            .subscribe((conversation) => {
                if (!conversation?.id) return;

                this.chatStoreService.closeAllProfileInformation();
                this.selectedConversation = conversation.id;

                const selectedConversation: ChatSelectedConversation = {
                    id: conversation?.id,
                    group,
                    name,
                    channelType,
                };
                this.chatStoreService.setConversation(selectedConversation);

                this.router.navigate([
                    ChatRoutesEnum.CONVERSATION,
                    conversation.id,
                ]);
            });
    }

    public closeProfileDetails(): void {
        this.chatStoreService.closeAllProfileInformation();
    }

    public displayProfileDetails(): void {
        if (!this.selectedConversation) {
            this.chatStoreService.displayProfileDetails();
            return;
        }

        this.chatService
            .getAllConversationFiles(this.selectedConversation)
            .pipe(
                map(
                    (
                        data: ConversationInfoResponse
                    ): ChatConversationDetails => {
                        return {
                            ...data,
                            userAdditionalInformation: [
                                ...this.conversation.participants,
                            ],
                        };
                    }
                ),
                takeUntil(this.destroy$)
            )
            .subscribe((data: ChatConversationDetails) => {
                this.chatStoreService.setProfileDetails(data);
            })
            .add(() => this.chatStoreService.displayProfileDetails());
    }
    public toggleChatPreferences(): void {
        this.isHamburgerMenuActive = !this.isHamburgerMenuActive;

        if (this.isHamburgerMenuActive) return;
        // On close save preferences
        // TODO Add API call, temporary local storage
        switch (true) {
            case this.chatPreferencesConfig[3].items[0].value:
                localStorage.setItem(
                    ChatStringTypeEnum.VIEW,
                    ChatViewTypeEnum.REGULAR
                );
                this.chatStoreService.setViewType(ChatViewTypeEnum.REGULAR);
                break;
            case this.chatPreferencesConfig[3].items[1].value:
                localStorage.setItem(
                    ChatStringTypeEnum.VIEW,
                    ChatViewTypeEnum.ADVANCED
                );
                this.chatStoreService.setViewType(ChatViewTypeEnum.ADVANCED);
                break;
            default:
                return;
        }
    }

    public selectFilter(filter: ChatToolbarActiveFilterEnum): void {
        if (this.activeFilter === filter) {
            this.activeFilter = null;
            return;
        }

        //TODO emit event?

        this.activeFilter = filter;
    }
}
