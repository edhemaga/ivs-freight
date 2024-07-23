import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileExtension',
    standalone: true
})
export class FileExtensionPipe implements PipeTransform {
    transform(url: string): any {
        if (!url) {
            return null;
        }

        const ext = url.split('.');

        return ext[ext.length - 1];
    }
}
