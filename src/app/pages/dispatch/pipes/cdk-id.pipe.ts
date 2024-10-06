import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cdkId',
    standalone: true,
})
export class CdkIdPipe implements PipeTransform {
    constructor() {}

    transform(rowIndex: number, gridIndex: number, type: string): string {
        return `${type}${Number(`${rowIndex}${gridIndex}`)}`;
    }
}
