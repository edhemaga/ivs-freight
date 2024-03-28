import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dynamicNavHeight',
    standalone: true
})
export class DynamicNavHeightPipe implements PipeTransform {
    transform(value: any, hover: boolean): any {
        return hover ? (value + 1) * 29 : 0;
    }
}
