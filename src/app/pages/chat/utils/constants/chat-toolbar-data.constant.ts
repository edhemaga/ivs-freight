// Models
import { ChatTab } from '@pages/chat/models';

export class ChatToolbarDataConstant {
    static tabs: ChatTab[] = [
        {
            id: 0,
            name: 'Conversation',
            count: 0,
            checked: true,
        },
        {
            id: 1,
            name: 'Archive',
            count: 0,
            checked: false,
        },
    ];
}
