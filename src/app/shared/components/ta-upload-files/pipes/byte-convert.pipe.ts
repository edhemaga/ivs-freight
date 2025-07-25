import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'byteConvert',
    standalone: true
})
export class ByteConvertPipe implements PipeTransform {
    transform(bytes: number): any {
        if (!+bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(0))} ${sizes[i]}`;
    }
}
