import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatDatePipe',
})
export class ChatDatePipe implements PipeTransform {
    transform(value: Date | string): string {
        const date = new Date(value);

        if (isNaN(date.getTime()))
            throw new Error('Invalid date');

        const day = ('0' + date.getDate()).slice(-2);
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }
}
