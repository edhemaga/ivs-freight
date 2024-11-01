import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getNumbers',
    standalone: true,
})
export class GetNumbersPipe implements PipeTransform {
    transform(value: string): string {
        if (typeof value == 'number') return value;
        return value.replace(/\D/g, ''); // Removes all non-numeric characters
    }
}