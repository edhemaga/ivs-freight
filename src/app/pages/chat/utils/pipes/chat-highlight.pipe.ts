import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'chatHighlight',
})
export class ChatHighlightPipe implements PipeTransform {
    transform(value: string, search: string): string {
        if (!search) {
            return value;
        }

        const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearch})`, 'gi');
        let highlightedText = `<span class="highlight">${value}</span>`; //value.replace(regex, `<span class="highlight">${search}</span>`);
        console.log(highlightedText);
        return highlightedText;
    }
}
