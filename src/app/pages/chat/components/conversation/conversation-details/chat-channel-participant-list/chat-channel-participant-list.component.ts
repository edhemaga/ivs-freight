import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { takeUntil, debounceTime } from 'rxjs/operators';

// Service
import { ChatStoreService } from '@pages/chat/services';

// Models
import { CompanyUserShortResponse } from 'appcoretruckassist';

// Utils
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';
import { ChatInput } from '@pages/chat/utils/configs';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { ChatSearchPlaceHolders } from '@pages/chat/enums';

@Component({
    selector: 'app-chat-channel-participant-list',
    templateUrl: './chat-channel-participant-list.component.html',
    styleUrls: ['./chat-channel-participant-list.component.scss'],
})
export class ChatChannelParticipantListComponent
    extends UnsubscribeHelper
    implements OnInit
{
    @Input() public conversationParticipants: CompanyUserShortResponse[] = [];

    @Output() public closeGroupMembersOverviewEvent: EventEmitter<boolean> =
        new EventEmitter();

    public searchConversationParticipants!: CompanyUserShortResponse[];

    public isSearchActive: boolean = false;

    public searchForm!: UntypedFormGroup;

    // Assets
    public chatSvgRoutes = ChatSvgRoutes;
    public chatInput = ChatInput;
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // Services
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.creteForm();
        this.listenForSearchTermChange();
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

                this.searchConversationParticipants =
                    this.conversationParticipants.filter((participant) =>
                        participant.fullName.toLowerCase().includes(searchTerm)
                    );
            });
    }

    public closeOverview(): void {
        this.chatStoreService.closeAllProfileInformation();
    }
}
