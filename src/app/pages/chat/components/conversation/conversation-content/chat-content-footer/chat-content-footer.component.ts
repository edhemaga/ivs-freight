import { Component, Input, OnInit } from '@angular/core';

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
    @Input() messageReplyInfo: {
        messageId: number;
        fullName: string;
        message: string;
    } | null = null;

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    constructor() {
        super();
    }

    ngOnInit(): void {}
}
