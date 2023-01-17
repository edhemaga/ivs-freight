import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableModalInputConfig',
})
export class TableModalInputConfigPipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return {
            ...value,
            id: args,
        };
    }
}
