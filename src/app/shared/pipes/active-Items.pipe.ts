import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'activeItems',
    standalone: true
})
export class ActiveItemsPipe implements PipeTransform {
    transform(array: any[]): any {
        return array.filter((item) => item.active).length;
    }
}
