import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'cdkid'
})
export class CdkIdPipe implements PipeTransform {
    constructor() {}

    transform(rowIndex: any, gridIndex: number, type: string) {
        rowIndex = parseInt(rowIndex + '' + gridIndex);
        return type + rowIndex;
    }
}
