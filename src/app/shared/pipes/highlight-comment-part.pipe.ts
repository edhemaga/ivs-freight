import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// enums
import { eColor, eStringPlaceholder } from '@shared/enums';

@Pipe({
    name: 'highlightCommentPart',
    standalone: true,
})
export class HighlightCommentPartPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(commentTitle: string, commentHighlight: string): SafeHtml {
        if (!commentTitle || !commentHighlight) return commentTitle;

        const sanitizedHtml = commentTitle.replace(
            new RegExp(commentHighlight, eStringPlaceholder.GI),
            (match) =>
                `<span class="highlighted" style="color:${eColor.BLUE_15}; background: ${eColor.BLUE_20}">${match}</span>`
        );

        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
    }
}
