import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'getNestedValue',
    standalone: true,
})
export class GetNestedValuePipe implements PipeTransform {
    transform(obj: any, key: string): any {
        if (!obj || !key) return null;

        return (
            key
                .replace(/\?\./g, '.')
                .split('.')
                .reduce((acc, key) => {
                    if (acc === null || acc === undefined) return null;

                    const index = Number(key);
                    return !isNaN(index) ? acc[index] : acc[key];
                }, obj) ?? 0
        );
    }
}
