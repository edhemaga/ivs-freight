import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sumArrays',
    standalone: true,
})
export class SumArraysPipe implements PipeTransform {
    transform(
        array: { id?: number; value?: number; reorderingNumber?: number }[]
    ): number {
        return array.reduce((accumulator, item: any) => {
            return accumulator + parseInt(item.value ? item.value : 0);
        }, 0);
    }
}
