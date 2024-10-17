import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'cdkConnect',
    standalone: true,
})
export class CdkConnectPipe implements PipeTransform {
    transform(
        rowIndex: number,
        gridLength: number,
        gridIndex: number,
        type: string
    ) {
        if (type === 'driver' && rowIndex === gridLength) return '';

        const data = [`${type}-1`];

        for (let i = 0; i < gridLength; i++) {
            const ni = parseInt(i + '' + gridIndex);

            if (i !== rowIndex) {
                data.push(type + ni);
            }
        }

        return data;
    }
}
