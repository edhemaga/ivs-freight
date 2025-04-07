import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eStringPlaceholder } from '@shared/enums';

@Pipe({
    name: 'getNestedValue',
    standalone: true,
})
export class GetNestedValuePipe implements PipeTransform {
    transform<T>(obj: T, key: string): string | number {
        if (!obj || !key) return null;

        return (
            key
                .replace(/\?\./g, eStringPlaceholder.DOT)
                .split(eStringPlaceholder.DOT)
                .reduce((acc, key) => {
                    if (acc === null || acc === undefined) return null;

                    const index = Number(key);
                    return !isNaN(index) ? acc[index] : acc[key];
                }, obj) ?? 0
        );
    }
}
