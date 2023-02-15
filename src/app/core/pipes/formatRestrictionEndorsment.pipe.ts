import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatRestEndor',
    standalone: true
})
export class FormatRestrictionEndorsmentPipe implements PipeTransform {
    transform(value1: string, value2: string): string {
        return value1?.concat(' - ', value2);
    }
}
