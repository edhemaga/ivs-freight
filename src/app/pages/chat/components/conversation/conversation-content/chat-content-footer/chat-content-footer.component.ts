import { Component, Input, OnInit } from '@angular/core';

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
    @Input() replyMessage: ChatMessageResponse | null = null;

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    constructor() {
        super();
    }

    public closeReply(): void {
        this.replyMessage = null;
    }

    ngOnInit(): void {
        console.log(this.replyMessage);
    }
}
