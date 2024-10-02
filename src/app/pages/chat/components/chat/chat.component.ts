import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, takeUntil } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
    closeAllProfileInformation,
    displayProfileDetails,
    getIsConversationParticipantsDisplayed,
    getIsProfileDetailsDisplayed,
    getSelectedConversation,
    setConversation,
} from '@pages/chat/state';

// Models
import {
    CompanyUserShortResponse,
    ConversationInfoResponse,
} from 'appcoretruckassist';
import {
    ChatResolvedData,
    CompanyUserChatResponsePaginationReduced,
    ChatTab,
    ChatCompanyChannelExtended,
    ChatSelectedConversation,
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
import { ChatToolbarDataConstant } from '@pages/chat/utils/constants';

// Routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Service
import { UserChatService, UserProfileService } from '@pages/chat/services';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers/unsubscribe-helper';

// Animations
import { chatFadeHorizontallyAnimation } from '@shared/animations';
import { setUnreadCount } from '../../state/actions/chat.actions';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    animations: [chatFadeHorizontallyAnimation],
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
    public conversation!: Observable<ChatSelectedConversation>;

    public ConversationTypeEnum = ConversationTypeEnum;

    public isAttachmentUploadActive: boolean = false;

    // User Profile Data
    public isProfileDetailsDisplayed: Observable<boolean>;
    public isParticipantsDisplayed: Observable<boolean>;

    public userProfileData!: Observable<ConversationInfoResponse>;

    // Tab and header ribbon configuration
    public tabs: ChatTab[] = ChatToolbarDataConstant.tabs;

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

        // Store
        private store: Store
    ) {
        super();
    }

    ngOnInit(): void {
        this.setUserProfileData();
        this.getDataOnLoad();
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

                this.store.dispatch(
                    setUnreadCount({
                        count: this.getUnreadCount(
                            this.companyUsers,
                            this.drivers
                        ),
                    })
                );
            });
        this.store.dispatch(closeAllProfileInformation());
        this.conversation = this.store.select(getSelectedConversation);
        this.isProfileDetailsDisplayed = this.store.select(
            getIsProfileDetailsDisplayed
        );
        this.isParticipantsDisplayed = this.store.select(
            getIsConversationParticipantsDisplayed
        );
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
        //TODO Create store and set value there
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

                this.store.dispatch(closeAllProfileInformation());
                this.selectedConversation = conversation.id;

                this.store.dispatch(
                    setConversation({
                        id: conversation?.id,
                        conversationType,
                        group,
                    })
                );
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

    public displayProfileDetails(value: boolean): void {
        this.store.dispatch(displayProfileDetails({ isDisplayed: value }));
        console.log();

        this.chatService
            .getAllConversationFiles(this.selectedConversation)
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: ConversationInfoResponse) => {
                this.store.dispatch(
                    displayProfileDetails({ isDisplayed: value })
                );
                this.userProfileService.setProfile(data);
            });
    }

    private setUserProfileData(): void {
        this.userProfileData = this.userProfileService.getProfile();
    }
}
