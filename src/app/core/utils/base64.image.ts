import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root',
})
export class ImageBase64Service {
    constructor(private domSanitizer: DomSanitizer) {}

    sanitizer(url: string) {
        return this.domSanitizer.bypassSecurityTrustResourceUrl(
            `data:image/*;base64,${url}`
        );
    }

    getStringFromBase64 = (url: string) => {
        return url.split(',')[1];
    };
}
