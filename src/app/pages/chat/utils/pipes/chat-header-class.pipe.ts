import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatGroupStateEnum } from '@pages/chat/enums/conversation/conversation-list/chat-group-state.enum';

@Pipe({
    name: 'chatHeaderClass'
})
export class ChatHeaderClassPipe implements PipeTransform {

    transform(
        count: number,
        state: ChatGroupStateEnum,
        unread: boolean
    ): string {
        if (count === 0) {
            return 'empty';
        }
        if (state === ChatGroupStateEnum.Expanded && unread) {
            return 'unread-expanded';
        }
        if (state === ChatGroupStateEnum.Expanded || state === ChatGroupStateEnum.AllExpanded) {
            return 'expanded';
        }
        if (state === ChatGroupStateEnum.Collapsed && unread) {
            return 'unread-collapsed';
        }
        if (state === ChatGroupStateEnum.Collapsed) {
            return 'collapsed';
        }
        return '';
    }
}
