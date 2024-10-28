import { Pipe, PipeTransform } from '@angular/core';

// Enums
import {
    ChatMessageArrivalTypeEnum,
    ChatStringTypeEnum,
} from '@pages/chat/enums';

// Helpers
import moment from 'moment';

@Pipe({
    name: 'chatDatePipe',
})
export class ChatDatePipe implements PipeTransform {
    transform(value: Date | string, isReceivedFromHub?: boolean): string {
        if (isReceivedFromHub) return ChatMessageArrivalTypeEnum.NEW;

        if (!value) return ChatStringTypeEnum.EMPTY;

        const a = moment();
        const b = moment(value);
        const diff = a.diff(b, 'days');

        if (diff < 1) return ChatMessageArrivalTypeEnum.TODAY;

        const date = new Date(value);

        if (isNaN(date.getTime())) throw new Error('Invalid date');

        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
}
