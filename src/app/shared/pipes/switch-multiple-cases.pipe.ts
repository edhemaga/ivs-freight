
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ngSwitchMultiCase',
    standalone: true,
})
export class NgSwitchMultiCasePipe implements PipeTransform {
    transform(
        case1: string, ...options: string[]
    ): string {
        console.log('NgSwitchMultiCasePipe case1', case1);
        console.log('NgSwitchMultiCasePipe options', options);
        console.log('NgSwitchMultiCasePipe options.includes', options.includes(case1) ? case1 : undefined);

        return options.includes(case1) ? case1 : undefined;
    }
}
