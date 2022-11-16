import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatRestEndor',
})
export class FormatRestrictionEndorsmentPipe implements PipeTransform {
    transform(value1: string, value2: string): string {
        return value1?.concat(' - ', value2);
    }
}
