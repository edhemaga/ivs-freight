import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'tableHighlightSearchText',
    standalone: true,
})
export class TableHighlightSearchTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(text: string, chips: string[]): SafeHtml {
        if (!chips?.length) {
            return text;
        }

        let newText = text.toString();

        // Map All Chips
        chips.forEach((chip, index) => {
            let pattern = chip.replace(
                /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                '\\$&'
            );

            pattern = pattern
                .split(' ')
                .filter((_pattern) => !!_pattern.length)
                .join('|');

            const regex = new RegExp('(' + pattern + ')(?!([^<]+)?>)', 'gi');

            newText = newText.replace(
                regex,
                (match) =>
                    `<span class="table-highlight-text-${index}">${match}</span>`
            );
        });

        return this.sanitizer.bypassSecurityTrustHtml(newText);
    }
}
