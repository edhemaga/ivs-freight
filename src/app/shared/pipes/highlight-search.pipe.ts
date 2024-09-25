import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// models
import { HighlightText } from '@shared/models/highlight-text.model';

@Pipe({
    name: 'taHighlight',
    standalone: true,
})
export class HighlightSearchPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(text: any, chips: HighlightText[]): SafeHtml {
        if (text && chips && chips.length) {
            text = text.toString();
            chips = chips.sort((a, b) => {
                return b.text.length - a.text.length;
            });
            chips.forEach((item) => {
                if (item.text && text && text !== 'No Results') {
                    let pattern = item.text
                        .toString()
                        .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                    pattern = pattern
                        .split(' ')
                        .filter((t) => {
                            return t.length > 0;
                        })
                        .join('|');
                    const regex = new RegExp(
                        '(' + pattern + ')(?!([^<]+)?>)',
                        'gi'
                    );
                    text = text.replace(
                        regex,
                        (match) =>
                            `<span class="highlight-text-${item.index}">${match}</span>`
                    );
                } else {
                    return text;
                }
            });

            return this.sanitizer.bypassSecurityTrustHtml(text);
        }
        return text;
    }
}
