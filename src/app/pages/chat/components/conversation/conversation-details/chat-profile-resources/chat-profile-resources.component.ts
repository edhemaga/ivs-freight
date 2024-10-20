import { Component, Input, OnInit } from '@angular/core';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

// Models
import { CompanyUserChatShortResponse, FileResponse } from 'appcoretruckassist';
import { ChatLink, ChatSelectedConversation } from '@pages/chat/models';

// Enums
import {
    ChatSearchPlaceHolders,
    ChatUserProfileResourceTypeEnum,
} from '@pages/chat/enums';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { ChatInput } from '@pages/chat/utils/configs';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

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

    // Enums
    public chatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;

    public isExpanded: boolean = false;

    constructor(private formBuilder: UntypedFormBuilder) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForSearchTermChange();
        this.groupUsersByType();
    }

    private groupUsersByType(): void {
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
                const searchTerm: string = search.searchTerm
                    .toLowerCase()
                    .trim();

                // this.searchConversationParticipants =
                //     this.conversationParticipants.filter((participant) =>
                //         participant.fullName.toLowerCase().includes(searchTerm)
                //     );
            });
    }

    public toggleShowAll(): void {
        this.isExpanded = !this.isExpanded;
    }
}
