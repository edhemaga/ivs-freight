import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keyValuePairs', standalone: true })
export class KeyValuePairsPipe implements PipeTransform {
    transform(value: { [key: string]: any }): { key: string; value: any }[] {
        return Object.keys(value).map((key) => ({ key, value: value[key] }));
    }
}
