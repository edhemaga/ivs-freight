import { DomSanitizer } from '@angular/platform-browser';

export class CardDropdownHelper {
    static higlitsPartOfCommentSearchValue(
        commentTitle: string,
        commentHighlight: string,
        sanitizer: DomSanitizer
    ): string {
        if (!commentTitle || !commentHighlight) return commentTitle;

        const sanitizedHtml = commentTitle.replace(
            new RegExp(commentHighlight, 'gi'),
            (match) => {
                return (
                    '<span class="highlighted" style="color:#0B49D1; background: #3B73ED33">' +
                    match +
                    '</span>'
                );
            }
        );

        return sanitizer.bypassSecurityTrustHtml(sanitizedHtml) as string;
    }
}
