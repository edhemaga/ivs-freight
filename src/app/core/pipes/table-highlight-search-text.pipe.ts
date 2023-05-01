import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
    name: 'tableHighlightSearchText',
    standalone: true,
})
export class TableHighlightSearchTextPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(text: any, chips: any[]): SafeHtml {
        if (!chips.length) {
            return text;
        }

        let newText = text;

        // Map All Chips
        chips.forEach((chip, index) => {
            let pattern = chip.replace(
                /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
                '\\$&'
            );

            pattern = pattern
                .split(' ')
                .filter((t) => {
                    return t.length > 0;
                })
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
