import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'driverEndorsementsText',
    standalone: true,
})
export class DriverEndorsementsPipe implements PipeTransform {
    constructor() {}

    transform(data: string[]) {
        let endorsementsText = '';

        const filteredData = data?.filter((item) => item);

        if (filteredData?.length)
            endorsementsText = '(' + data.join('&middot;') + ')';

        return endorsementsText;
    }
}
