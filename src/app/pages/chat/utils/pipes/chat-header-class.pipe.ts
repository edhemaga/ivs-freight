import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatGroupStateEnum } from '@pages/chat/enums';

@Pipe({
    name: 'chatHeaderClass',
})
export class ChatHeaderClassPipe implements PipeTransform {
    transform(
        count: number,
        state: ChatGroupStateEnum,
        unread: boolean
    ): string {
        switch (true) {
            case !count:
                return 'empty';
            case state === ChatGroupStateEnum.Expanded && unread:
                return 'unread-expanded';
            case state === ChatGroupStateEnum.Expanded ||
                state === ChatGroupStateEnum.AllExpanded:
                return 'expanded';
            case state === ChatGroupStateEnum.Collapsed && unread:
                return 'unread-collapsed';
            case state === ChatGroupStateEnum.Collapsed:
                return 'collapsed';
            default:
                return '';
        }
    }
}
