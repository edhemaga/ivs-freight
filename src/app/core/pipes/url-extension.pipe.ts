import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlExtension',
})
export class UrlExtensionPipe implements PipeTransform {
  transform(url: string): any {
    if (!url) {
      return null;
    }

    const ext = url.split('.');

    return ext[ext.length-1];
  }
}
