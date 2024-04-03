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
                    '<span class="highlighted" style="color:#92b1f5; background: #6f9ee033">' +
                    match +
                    '</span>'
                );
            }
        );

        return sanitizer.bypassSecurityTrustHtml(sanitizedHtml) as string;
    }
}
