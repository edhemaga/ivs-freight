import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

export const getStringFromBase64 = (url: string) => {
  return url.split(',')[1];
};

@Injectable()
export class CreateBase64Class {
  constructor(public domSanitizer: DomSanitizer) {}

  sanitizer(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      `data:image/*;base64,${url}`
    );
  }
}
