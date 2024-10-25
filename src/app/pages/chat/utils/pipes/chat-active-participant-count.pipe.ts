import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatActiveParticipantCount',
})
export class ChatActiveParticipantCountPipe implements PipeTransform {
    transform(value: any[]): unknown {
        const count: number = value.filter((item) => item?.isActive).length;
        return count;
    }
}
