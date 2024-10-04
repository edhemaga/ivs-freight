import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Observable } from 'rxjs';

// Store
import { Store } from '@ngrx/store';
import {
    closeAllProfileInformation,
    displayConversationParticipants,
    getSelectedConversation,
    setConversation,
    setMessageResponse,
    selectAttachments,
    setAttachmentUploadActiveStatus,
    getIsAttachmentUploadActive,
    setAttachment,
} from '@pages/chat/store';

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
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { ChatDropzone } from '@pages/chat/utils/configs';

@Component({
    selector: 'app-conversation-content',
    templateUrl: './conversation-content.component.html',
    styleUrls: ['./conversation-content.component.scss'],
})
export class ConversationContentComponent
    extends UnsubscribeHelper
    implements OnInit {
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.store.dispatch(
                setAttachmentUploadActiveStatus({ isDisplayed: false })
            );
    }
    @Input() group: ChatGroupEnum;

    @Output() isProfileDetailsDisplayed: EventEmitter<boolean> =
        new EventEmitter();

    // Group info
    public chatConversationType = ChatConversationType;
    public chatGroupEnum = ChatGroupEnum;

    //User data
    private getCurrentUserHelper = GetCurrentUserHelper;

    public conversation$!: Observable<ChatSelectedConversation>;
    public isAttachmentUploadActive: Observable<boolean>;

    // Assets & configs
    public chatSvgRoutes = ChatSvgRoutes;
    public chatDropzone = ChatDropzone;

    constructor(
        // Router
        private activatedRoute: ActivatedRoute,

        // Store
        private store: Store
    ) {
        super();
    }

    ngOnInit(): void {
        this.getResolvedData();
    }

    private getResolvedData(): void {
        this.store.dispatch(closeAllProfileInformation());
        this.isAttachmentUploadActive = this.store
            .select(getIsAttachmentUploadActive)
            .pipe(takeUntil(this.destroy$));

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
                this.conversation$ = this.store.select(getSelectedConversation);
                this.store.dispatch(closeAllProfileInformation());
            });
    }

    public displayGroupParticipants(): void {
        this.store.dispatch(
            displayConversationParticipants({ isDisplayed: true })
        );
    }

    public addAttachments(files: UploadFile[]): void {
        files.forEach((file) => {
            this.store.dispatch(setAttachment(file));
        });
        this.store.dispatch(
            setAttachmentUploadActiveStatus({ isDisplayed: false })
        );

        // this.enableChatInput();
    }
}
