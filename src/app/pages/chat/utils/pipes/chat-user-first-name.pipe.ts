import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatStringTypeEnum } from '@pages/chat/enums';

@Pipe({
    name: 'chatUserFirstName',
})
export class ChatUserFirstNamePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return;
        return value.trim().split(ChatStringTypeEnum.WHITE_SPACE)[0];
    }
}
