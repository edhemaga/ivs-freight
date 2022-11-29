import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'hosTime',
})
export class HosTimePipe implements PipeTransform {
    constructor() {}

    transform(data: any) {
        if (data.length === 0) {
            return new Date().getHours();
        } else {
            let activeHours = 0;
            activeHours =
                data[data.length - 1].end - data[data.length - 1].start;
            return (activeHours / 60).toFixed(0);
        }
    }
}
