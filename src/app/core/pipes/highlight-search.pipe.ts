import {Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { HighlightText } from '../model/searchFilter';

@Pipe({
  name: 'taHighlight',
})
export class HighlightSearchPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(text: any, chips: HighlightText[]): SafeHtml {
    if (text && chips && chips.length) {
      text = text.toString();
      chips = chips.sort((a, b) => {
        return b.text.length - a.text.length;
      });
      chips.forEach((item, key) => {
        if (item.text && text) {
          let pattern = item.text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
          pattern = pattern
            .split(' ')
            .filter((t) => {
              return t.length > 0;
            })
            .join('|');
          const regex = new RegExp('(' + pattern + ')(?!([^<]+)?>)', 'gi');
          text = text.replace(
            regex,
            (match) => `<span class="highlight-text-${item.index}">${match}</span>`
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
