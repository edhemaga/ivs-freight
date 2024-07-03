import { Pipe, type PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CardDropdownHelper } from '@shared/utils/helpers/card-dropdown-helper';

@Pipe({ name: 'taCommentHighlistComponentPipe', standalone: true })
export class TaCommentHighlistComponentPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(commentTitle: string, commentHighlight: string): string {
        return CardDropdownHelper.higlitsPartOfCommentSearchValue(
            commentTitle,
            commentHighlight,
            this.sanitizer
        );
    }
}
