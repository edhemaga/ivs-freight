import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatAnyExist',
})
export class ChatAnyExist implements PipeTransform {
    transform(...args: unknown[]): boolean {
        return args.some((arg) => arg !== null);
    }
}
