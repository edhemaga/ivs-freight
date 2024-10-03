import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, takeUntil, Observable, filter } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
    displayConversationParticipants,
    getSelectedConversation,
    setConversation,
    setMessageResponse,
} from '@pages/chat/store';

// Models
import {
    ChatConversationMessageAction,
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
} from '@pages/chat/models';
import {
    CompanyUserShortResponse,
    ConversationResponse,
} from 'appcoretruckassist';

// Enums
import {
    ChatConversationType,
    ChatGroupEnum,
    ChatMessageActionEnum,
} from '@pages/chat/enums';

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
        private router: Router,
        private activatedRoute: ActivatedRoute,

        // Store
        private store: Store
    ) {
        super();
    }

    ngOnInit(): void {
        this.getResolvedData();
        this.getDataOnRouteChange();
    }

    private getResolvedData(): void {
        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.store.dispatch(
                    setConversation({
                        participants: res.information?.participants.filter(
                            (participant) =>
                                participant.id !==
                                this.getCurrentUserHelper.currentUserId
                        ),
                        name:
                            res.information.name ??
                            res.information?.participants[0]?.fullName,
                        description: res.information?.description,
                        createdAt: res.information?.createdAt,
                        updatedAt: res.information?.updatedAt,
                    })
                );

                this.store.dispatch(
                    setMessageResponse({
                        ...res?.messages,
                    })
                );

                this.conversation = this.store.select(getSelectedConversation);
            });
    }

    public displayGroupParticipants(): void {
        this.store.dispatch(
            displayConversationParticipants({ isDisplayed: true })
        );
    }

    private getDataOnRouteChange(): void {
        this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.isProfileDetailsDisplayed.emit(false);
        });

        this.activatedRoute.queryParams.subscribe((params) => {
            this.group =
                params[this.chatConversationType.CHANNEL] != this.group
                    ? params[this.chatConversationType.CHANNEL]
                    : this.group;
        });
    }
}
