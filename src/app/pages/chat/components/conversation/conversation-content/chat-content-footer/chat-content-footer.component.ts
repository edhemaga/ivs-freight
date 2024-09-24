import { Component } from '@angular/core';

// Assets
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
    selector: 'app-chat-content-footer',
    templateUrl: './chat-content-footer.component.html',
    styleUrls: ['./chat-content-footer.component.scss'],
})
export class ChatContentFooterComponent {

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;
}
