import { Injectable } from '@angular/core';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class ImageBase64Service {
    constructor(private domSanitizer: DomSanitizer) {}

    public sanitizer(url: string): SafeResourceUrl {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(
            `data:image/*;base64,${url}`
        );
    }

    public getStringFromBase64(url: string): string {
        return url.split(',')[1];
    }
}
