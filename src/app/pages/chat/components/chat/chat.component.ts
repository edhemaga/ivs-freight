import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, takeUntil } from 'rxjs';

// Models
import { ConversationInfoResponse } from 'appcoretruckassist';
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
    ConversationTypeEnum,
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

    // Assets and enums
    public chatSvgRoutes = ChatSvgRoutes;
    public chatGridLayout = ChatGridLayout;
    public chatConversationProfileDetailsType =
        ChatConversationProfileDetailsType;

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
                this.title = res.title;
                this.drivers = res.drivers;
                this.companyUsers = res.users;
                this.departments = res.departments;
                this.tabs[0].count =
                    this.drivers.count +
                    this.companyUsers.count +
                    this.departments.length;

                const unreadCount = this.getUnreadCount(
                    this.companyUsers,
                    this.drivers
                );
                this.chatStoreService.setUnreadCount(unreadCount);
                this.chatStoreService.closeAllProfileInformation();
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
        group: ChatGroupEnum
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
                };
                this.chatStoreService.setConversation(selectedConversation);

                this.router.navigate([
                    ChatRoutesEnum.CONVERSATION,
                    conversation.id,
                ]);
            });
    }

    private getUnreadCount(
        users: CompanyUserChatResponsePaginationReduced,
        drivers: CompanyUserChatResponsePaginationReduced,
        archivedUsers?: CompanyUserChatResponsePaginationReduced,
        archivedDrivers?: CompanyUserChatResponsePaginationReduced
    ): number {
        let totalUnreadCount = 0;
        // Users
        totalUnreadCount = users.data.reduce((accumulator, currentObject) => {
            return accumulator + (currentObject.hasUnreadMessage ? 1 : 0);
        }, 0);

        if (archivedUsers)
            totalUnreadCount = archivedUsers.data.reduce(
                (accumulator, currentObject) => {
                    return (
                        accumulator + (currentObject.hasUnreadMessage ? 1 : 0)
                    );
                },
                0
            );

        // Drivers
        totalUnreadCount = drivers.data.reduce((accumulator, currentObject) => {
            return accumulator + (currentObject.hasUnreadMessage ? 1 : 0);
        }, 0);

        if (archivedDrivers)
            totalUnreadCount = archivedUsers.data.reduce(
                (accumulator, currentObject) => {
                    return (
                        accumulator + (currentObject.hasUnreadMessage ? 1 : 0)
                    );
                },
                0
            );

        return totalUnreadCount;
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
    }
}
