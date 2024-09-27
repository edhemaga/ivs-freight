import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// Models
import { ChatMessageResponse } from '@pages/chat/models';

// Helpers
import { UnsubscribeHelper } from '@pages/chat/utils/helpers';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
    selector: 'app-chat-content-footer',
    templateUrl: './chat-content-footer.component.html',
    styleUrls: ['./chat-content-footer.component.scss'],
})
export class ChatContentFooterComponent
    extends UnsubscribeHelper
    implements OnInit
{
    @Input() currentUserTyping!: string;
    @Input() replyMessage: BehaviorSubject<ChatMessageResponse | null> =
        new BehaviorSubject(null);
    @Input() editMessage: BehaviorSubject<ChatMessageResponse | null> =
        new BehaviorSubject(null);

    @Output() closeReplyEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() closeEditEvent: EventEmitter<boolean> = new EventEmitter();

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    constructor() {
        super();
    }

    ngOnInit(): void {}

    public closeReplyOrEdit(): void {
        this.closeReplyEvent.emit(true);
        this.closeEditEvent.next(true);
    }
}
