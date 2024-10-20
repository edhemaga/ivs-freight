import { Component, Input, OnInit } from '@angular/core';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Models
import { CompanyUserChatShortResponse, FileResponse } from 'appcoretruckassist';
import { ChatLink, ChatSelectedConversation } from '@pages/chat/models';

// Enums
import {
    ChatRoutesEnum,
    ChatSearchPlaceHolders,
    ChatUserProfileResourceTypeEnum,
    ConversationTypeEnum,
} from '@pages/chat/enums';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { ChatInput } from '@pages/chat/utils/configs';

// Helpers
import {
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';

// Services
import { ChatStoreService, UserChatService } from '@pages/chat/services';
import { Router } from '@angular/router';

@Component({
    selector: 'app-chat-profile-resources',
    templateUrl: './chat-profile-resources.component.html',
    styleUrls: ['./chat-profile-resources.component.scss'],
})
export class ChatProfileResourcesComponent
    extends UnsubscribeHelper
    implements OnInit
{
    @Input() public title!: string;
    @Input() public hasHorizontalBorder: boolean = true;
    @Input() public customClass!: string;
    @Input() public count: number = 0;
    @Input() public type: ChatUserProfileResourceTypeEnum;
    @Input() public conversation!: ChatSelectedConversation;

    // Resources
    @Input() resources: Array<FileResponse | ChatLink | null>;

    // User types
    public companyUsers: CompanyUserChatShortResponse[] = [];
    public drivers: CompanyUserChatShortResponse[] = [];

    public searchForm!: UntypedFormGroup;

    // Assets
    public chatInput = ChatInput;
    public chatSvgRoutes = ChatSvgRoutes;
    private getCurrentUserHelper = GetCurrentUserHelper;

    // Enums
    public chatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;

    // Settings
    public isExpanded: boolean = false;
    public hoveredUserId: number = 0;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // Router
        private router: Router,

        // Services
        private chatService: UserChatService,
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForSearchTermChange();
        this.groupUsersByType();
    }

    public groupUsersByType(): void {
        this.drivers = [];
        this.companyUsers = [];

        if (!this.conversation) return;
        this.conversation?.participants?.forEach((participant) => {
            if (participant.userType?.name === 'Driver') {
                this.drivers = [...this.drivers, participant];
            } else {
                this.companyUsers = [...this.companyUsers, participant];
            }
        });
    }

    private creteForm(): void {
        this.searchForm = this.formBuilder.group({
            searchTerm: [null],
        });
    }

    private listenForSearchTermChange(): void {
        if (!this.searchForm) return;

        this.searchForm.valueChanges
            .pipe(takeUntil(this.destroy$), debounceTime(350))
            .subscribe((search: { searchTerm: string }) => {
                if (!search.searchTerm) {
                    this.groupUsersByType();
                    return;
                }
                const searchTerm: string = search.searchTerm
                    ?.toLowerCase()
                    ?.trim();

                this.companyUsers = this.companyUsers.filter((participant) =>
                    participant.fullName.toLowerCase().includes(searchTerm)
                );

                this.drivers = this.drivers.filter((participant) =>
                    participant.fullName.toLowerCase().includes(searchTerm)
                );
            });
    }

    public toggleShowAll(): void {
        this.isExpanded = !this.isExpanded;
    }

    public toggleHover(value: number): void {
        this.hoveredUserId = value;
    }

    public selectConversation(userId: number): void {
        const currentUser: number = this.getCurrentUserHelper.currentUserId;
        if (!userId || !currentUser) return;

        const participantIds: number[] = [userId];
        this.chatService
            .createConversation(
                participantIds,
                ConversationTypeEnum.SINGLE_CHAT
            )
            .pipe(takeUntil(this.destroy$))
            .subscribe((conversation) => {
                if (!conversation?.id) return;

                this.chatStoreService.closeAllProfileInformation();

                const selectedConversation: ChatSelectedConversation = {
                    id: conversation?.id,
                };
                this.chatStoreService.setConversation(selectedConversation);

                this.router.navigate([
                    ChatRoutesEnum.CONVERSATION,
                    conversation.id,
                ]);
            });
    }
}
