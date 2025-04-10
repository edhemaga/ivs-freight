import { Pipe, PipeTransform } from '@angular/core';
import { eStringPlaceholder } from 'ca-components';

@Pipe({
    name: 'abbreviateFullname',
    standalone: true,
})
export class AbbreviateFullnamePipe implements PipeTransform {
    transform(fullName: string): string {
        if (!fullName) return eStringPlaceholder.EMPTY;

        const words = fullName.split(eStringPlaceholder.WHITESPACE);

        if (fullName.length > 19 && words.length > 1)
            return `${words[0].charAt(0)}. ${words.slice(1).join(eStringPlaceholder.WHITESPACE)}`;

        return fullName;
    }
}
