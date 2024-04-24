import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'ngForLengthFilter',
    standalone: true,
})
export class NgForLengthFilterPipe implements PipeTransform {
    transform(data: any[], length: number): any {
        return Array.from({ length }, (_, i) => data[i]);
    }
}
