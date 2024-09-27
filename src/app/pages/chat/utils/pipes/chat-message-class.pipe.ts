import { Pipe, PipeTransform } from '@angular/core';
import { ChatMessage } from '@pages/chat/models';

@Pipe({
    name: 'chatMessageClass',
})
export class ChatMessageClassPipe implements PipeTransform {
    transform(
        currentUserId: number,
        senderId: number,
        isMessageReply: boolean,
        isMessageEdit: boolean,
        isOpen: boolean
    ): string {
        const isCurrentUser: boolean = currentUserId === senderId;
        const isSelected: boolean = isMessageReply || isMessageEdit;

        let classString = '';

        switch (true) {
            case !isOpen && isCurrentUser:
                classString = 'current-user';
                break;
            case !isOpen && !isCurrentUser:
                classString = 'other';
                break;
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
        }
        return classString;
    }
}
