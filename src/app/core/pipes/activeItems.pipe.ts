import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activeItems',
})
export class ActiveItemsPipe implements PipeTransform {
    transform(array: any[]): any {
        return array.filter((item) => item.active).length;
    }
}
