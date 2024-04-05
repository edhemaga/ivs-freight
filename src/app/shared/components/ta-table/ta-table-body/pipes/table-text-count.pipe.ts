import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'tableTextCount',
})
export class TableTextCountPipe implements PipeTransform {
    transform(text: string[]): string {
        let filteredText: string = '';

        if (Array.isArray(text)) {
            for (let i = 0; i < 3; i++) {
                text[i] ? (filteredText += text[i]) : (filteredText += '');

                if (i !== 3 && text[i + 1]) {
                    filteredText += ' • ';
                }
            }

            if (text.length > 3) {
                filteredText += `<div class="d-flex justify-content-center align-items-center">
                  <span class="ta-font-medium">+${text.length - 3}</span>
              </div>`;
            }

            return filteredText;
        }

        return text;
    }
}
