import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    HostListener,
    ViewChild,
    ElementRef,
    AfterContentChecked,
    AfterViewInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, Observable, map, skip } from 'rxjs';

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
    scrollToBottom,
    scrollToTop,
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
    implements OnInit, AfterViewInit, AfterContentChecked
{
    @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape')
            this.chatStoreService.closeAttachmentUpload();
    }
    @ViewChild('messagesComponent', { static: false })
    messagesComponent!: ElementRef;

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
    public wrapperHeightPx: number = 0;
    public maxHeight: number = 0;
    public isScrollToBottomDisplayed: boolean = false;
    public hasNewMessages: boolean = false;

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

    ngAfterViewInit(): void {
        this.scrollOnMessage();
    }

    ngAfterContentChecked(): void {
        this.wrapperHeightPx =
            this.messagesComponent?.nativeElement?.offsetHeight ?? 0;
    }

    private initStoreData(): void {
        this.chatStoreService.closeAllProfileInformation();
        this.conversation$ = this.chatStoreService.selectConversation();
        this.conversation$.subscribe(() => {
            this.isScrollToBottomDisplayed = false;
        });
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
                    isArchived: res.information?.isArchived,
                    channelType: res.information?.channelType,
                    conversationType: res.information?.conversationType,
                };
                this.chatStoreService.setConversation(selectedConversation);
            });
    }

    public addAttachments(files: UploadFile[]): void {
        files.forEach((file: UploadFile) => {
            this.chatStoreService.setAttachment(file);
        });
        this.chatStoreService.closeAttachmentUpload();
    }

    private scrollOnMessage(): void {
        this.maxHeight = this.messagesComponent?.nativeElement?.scrollHeight;
        scrollToBottom(this.messagesComponent?.nativeElement);

        this.chatStoreService
            .selectMessages()
            .pipe(skip(2))
            .subscribe(() => {
                this.hasNewMessages = true;
            });
    }

    public scrollToBottom(): void {
        scrollToBottom(this.messagesComponent?.nativeElement);
        this.hasNewMessages = false;
    }

    public scrollTop(): void {
        scrollToTop(this.messagesComponent?.nativeElement);
    }

    private isScrollAvailable(scrollOffset?: number): boolean {
        const scrollPx: number =
            this.messagesComponent?.nativeElement?.scrollTop;
        return scrollPx < this.maxHeight - scrollOffset;
    }

    public messagesScroll(): void {
        // TODO Adjust later, initial idea
        if (this.isScrollAvailable(this.wrapperHeightPx + 100))
            this.isScrollToBottomDisplayed = true;
        else this.isScrollToBottomDisplayed = false;
    }
}
