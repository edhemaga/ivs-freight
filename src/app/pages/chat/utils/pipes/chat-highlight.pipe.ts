import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatHighlight',
})
export class ChatHighlightPipe implements PipeTransform {
    transform(value: string, search: string): string {
        if (!search) {
            return value;
        }

        const escapedSearch = search
            .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
            .substring(1);
        const regex = new RegExp(`(${escapedSearch})`, 'gi');

        const highlightedText = value.replace(regex, (match) => {
            return `<span class="highlight">${match}</span>`;
        });

        return highlightedText;
    }
}
