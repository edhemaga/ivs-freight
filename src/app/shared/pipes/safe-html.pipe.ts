import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safeHtml',
standalone: true })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) {}

    transform(value: any) {
        return value ? this.sanitized.bypassSecurityTrustHtml(value) : '';
    }
}
