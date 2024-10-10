import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatRemoveFullname',
})
export class ChatRemoveFullnamePipe implements PipeTransform {
    transform(content: string, fullName: string): string {
        if (!content || !fullName) {
            return content;
        }
        const regex = new RegExp(`\\b${fullName}\\b`, 'gi');
        return content.replace(regex, '').trim();
    }
}
