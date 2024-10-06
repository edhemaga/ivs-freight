import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Observable, map } from 'rxjs';

// Services
import { ChatStoreService } from '@pages/chat/services';

// Models
import { ChatSelectedConversation } from '@pages/chat/models';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Enums
import { ChatConversationType, ChatGroupEnum } from '@pages/chat/enums';

// Helpers
import {
    GetCurrentUserHelper,
    UnsubscribeHelper,
} from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';
import { ChatDropzone } from '@pages/chat/utils/configs';

@Component({
    selector: 'app-conversation-content',
    templateUrl: './conversation-content.component.html',
    styleUrls: ['./conversation-content.component.scss'],
})
export class ConversationContentComponent
    extends UnsubscribeHelper
    implements OnInit
{
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.chatStoreService.closeAttachmentUpload();
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
    public isAttachmentUploadActive$: Observable<boolean>;

    // Assets & configs
    public chatSvgRoutes = ChatSvgRoutes;
    public chatDropzone = ChatDropzone;

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
        this.initStoreData();
    }

    private initStoreData(): void {
        this.chatStoreService.closeAllProfileInformation();
        this.conversation$ = this.chatStoreService.selectConversation();
        this.isAttachmentUploadActive$ =
            this.chatStoreService.selectAttachmentUploadStatus();
    }

    private getResolvedData(): void {
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
                })
            )
            .subscribe((res) => {
                const selectedConversation: ChatSelectedConversation = {
                    id: res.information?.id,
                    participants: res.information?.participants,
                    name: res.information?.name,
                    description: res.information?.description,
                    createdAt: res.information?.createdAt,
                    updatedAt: res.information?.updatedAt,
                };
                this.chatStoreService.setConversation(selectedConversation);
            });
    }

    public displayGroupParticipants(): void {
        this.chatStoreService.displayConversationParticipants();
    }

    public addAttachments(files: UploadFile[]): void {
        files.forEach((file: UploadFile) => {
            this.chatStoreService.setAttachment(file);
        });
        this.chatStoreService.closeAttachmentUpload();
    }
}
