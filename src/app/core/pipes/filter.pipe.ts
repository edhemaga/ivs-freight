import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    pure: false,
})
export class FilterPipe implements PipeTransform {
    transform(list: any[] | undefined, isDeleted: boolean) {
        return list?.filter((item) => item.isDeleted === isDeleted);
    }
}
