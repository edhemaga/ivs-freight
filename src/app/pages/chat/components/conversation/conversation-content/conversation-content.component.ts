import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Observable, tap, map } from 'rxjs';

// Store
import {
    closeAllProfileInformation,
    displayConversationParticipants,
    getSelectedConversation,
} from '@pages/chat/store';

// Services
import { ChatStoreService } from '@pages/chat/services';

// Models
import { ChatSelectedConversation } from '@pages/chat/models';

// Enums
import { ChatConversationType, ChatGroupEnum } from '@pages/chat/enums';

// Helpers
import {
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
    selector: 'app-conversation-content',
    templateUrl: './conversation-content.component.html',
    styleUrls: ['./conversation-content.component.scss'],
})
export class ConversationContentComponent
    extends UnsubscribeHelper
    implements OnInit
{
    @Input() group: ChatGroupEnum;
    @Input() public isAttachmentUploadActive: boolean = false;

    @Output() isProfileDetailsDisplayed: EventEmitter<boolean> =
        new EventEmitter();

    // Group info
    public chatConversationType = ChatConversationType;
    public chatGroupEnum = ChatGroupEnum;

    //User data
    private getCurrentUserHelper = GetCurrentUserHelper;

    public conversation!: Observable<ChatSelectedConversation>;

    // Assets
    public chatSvgRoutes = ChatSvgRoutes;

    constructor(
        // Router
        private activatedRoute: ActivatedRoute,

        // Services
        private chatStoreService: ChatStoreService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getResolvedData();
    }

    private getResolvedData(): void {
        // this.chatStoreService.selectConversation();

        this.activatedRoute.data
            .pipe(
                takeUntil(this.destroy$),
                map((res) => {
                    return {
                        ...res,
                        information: {
                            ...res?.information,
                            name:
                                res.information.name ??
                                res.information?.participants[0]?.fullName,
                            participants: res.information?.participants.filter(
                                (participant) =>
                                    participant.id !==
                                    this.getCurrentUserHelper.currentUserId
                            ),
                        },
                    };
                }),
                tap()
            )
            .subscribe((res) => {
                const selectedConversation: ChatSelectedConversation = {
                    participants: res.information.participants,
                    name: res.information.name,
                    description: res.information?.description,
                    createdAt: res.information?.createdAt,
                    updatedAt: res.information?.updatedAt,
                };
                this.chatStoreService.setConversation(selectedConversation);
                this.chatStoreService.closeAllProfileInformation();
                this.chatStoreService.selectConversation();
            });
    }

    public displayGroupParticipants(): void {
        this.chatStoreService.displayConversationParticipants();
    }
}
