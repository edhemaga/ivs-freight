import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { ChatStringTypeEnum } from '@pages/chat/enums';

@Pipe({
    name: 'chatRemoveFullname',
})
export class ChatRemoveFullnamePipe implements PipeTransform {
    transform(content: string, fullName: string): string {
        if (!content || !fullName) return content;

        const regex = new RegExp(`\\b${fullName}\\b`, 'gi');
        return content.replace(regex, ChatStringTypeEnum.EMPTY).trim();
    }
}
