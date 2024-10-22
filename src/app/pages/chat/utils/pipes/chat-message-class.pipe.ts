import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatStringTypeEnum } from '@pages/chat/enums';

@Pipe({
    name: 'chatMessageClass',
})
export class ChatMessageClassPipe implements PipeTransform {
    transform(
        currentUserId: number,
        senderId: number,
        isSelected: boolean
    ): string {
        const isCurrentUser: boolean = currentUserId === senderId;

        let classString: string = ChatStringTypeEnum.EMPTY;

        switch (true) {
            case isCurrentUser && isSelected:
                classString = 'current-user-selected';
                break;
            case isCurrentUser && !isSelected:
                classString = 'current-user';
                break;
            case !isCurrentUser && isSelected:
                classString = 'other-selected';
                break;
            case !isCurrentUser && !isSelected:
                classString = 'other';
                break;
            default:
                classString = isCurrentUser ? 'current-user' : 'other';
        }
        return classString;
    }
}
